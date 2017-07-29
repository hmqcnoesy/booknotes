# REMP Migration 

Login to the broker database as broker_admin.  Then you'll have access to dblinks to both the simulator database (`@remp`) and the production database (`@productionremp`).

If desired, change the definition of the `broker_admin.plates_to_migrate` view.  This view is used by the migration procedure to determine which production plates to migrate.  For example, a small partial migration might include just the plates stored in stack 19:

```sql
create or replace view plates_to_migrate as
select p.id, p.ext_id, p.barcode, a.logical_id aisle, st.logical_id stack, sps.level_number, ppr.slot, r.id rack_id
from plate@productionremp p
join plate_position_rrack@productionremp ppr on p.ppo_id = ppr.id
join rrack@productionremp r on r.id = ppr.rra_id
join shelf@productionremp s on s.rpo_id = r.default_rpo_id
join shelf_position_stack@productionremp sps on sps.id = s.rpo_id
join stack@productionremp st on st.id = sps.stk_id
join aisle@productionremp a on a.id = st.ais_id
where st.logical_id = 19
```

Run the following pl/sql procudure to copy production data to the simulator database:

```sql
declare
  rrack_position_count_prod INTEGER;
  rrack_position_count_sim INTEGER;
  found_id INTEGER;
begin

  --sim has fewer rrack_position records, add them if needed
  select count(*) into rrack_position_count_prod from rrack_position@productionremp;
  select count(*) into rrack_position_count_sim from rrack_position@remp;
  for i in rrack_position_count_sim..(rrack_position_count_prod - 1) loop
    insert into rrack_position@remp values ((select max(rpo_id) + 1 from rrack_position@remp), 0, 1, sysdate, 'MSS');
  end loop;
  
  
  delete from plate_position_rrack@remp;
  delete from plate_position@remp where ppo_id not in (select ppo_id from plate_handling_position@remp);
  delete from rrack@remp;
  
  -- insert rrack
  for rack in (select r.*, st.logical_id, sps.level_number 
               from rrack@productionremp r join shelf@productionremp s on s.rpo_id = r.default_rpo_id 
               join shelf_position_stack@productionremp sps on sps.id = s.spo_Id 
               join stack@productionremp st on st.id = sps.stk_id 
               where r.id in (select rack_id from plates_to_migrate)) loop
    select s.rpo_id into found_id from shelf@remp s join shelf_position_stack@remp sps on s.spo_id = sps.id join stack@remp st on st.id = sps.stk_id where st.logical_id = rack.logical_id and sps.level_number = rack.level_number;
    insert into rrack@remp values (rack.id, rack.barcode, found_id, decode(rack.rty_id, 1,199, 3,201, -1), found_id, null, null, rack.mut_counter, rack.mut_datetime, rack.mut_user);
  end loop;
  
  -- delete plate position records, insert to match production, ignoring plate handling positions
  for pp in (select * from plate_position@productionremp where ppo_id not in (select ppo_id from plate_handling_position@productionremp)) loop
    insert into plate_position@remp values (pp.ppo_id, 1, sysdate, 'MSS', 0);
  end loop;
  
  -- insert plate position rrack records to match production
  for ppr in (select * from plate_position_rrack@productionremp where rra_id in (select rack_id from plates_to_migrate)) loop
    insert into plate_position_rrack@remp values (ppr.id, ppr.rra_id, ppr.slot, ppr.mut_counter, ppr.mut_datetime, ppr.mut_user);
  end loop;
  
  -- dont' mess with handling positions
  --for pos in (select * from plate_handling_position@productionremp) loop
  --  insert into plate_handling_position@remp values (decode(pos.pht_id, 2,102, 7,110, 12,108, 10,111, 8,107, 6,112, 4,105, 9,101, 3,103, 11,104, 5,106, 1,109, -1), pos.ppo_id, null, pos.mut_user, pos.mut_datetime, pos.mut_counter);
  --end loop;
  
  -- don't mess with adapter records
  --for adapter in (select * from adapter@productionremp) loop
  --  insert into adapter@remp values (adapter.id, decode(adapter.adt_id, 1,22, 2,23, 3,24, -1), adapter.ppo_id, adapter.mut_user, adapter.mut_datetime, adapter.mut_counter);
  --end loop;
  
  -- insert plates 
  for plate in (select p.*, ps.vps_row_nr, ps.vps_level_nr, ps.vps_pos_in_sr 
                from plate@productionremp p join vsas_plates_in_store@productionremp ps on p.ext_id = ps.vps_plate_id 
                where id in (select id from plates_to_migrate)) loop
    insert into plate@remp values (
                           plate.id, 
                           plate.ext_id, 
                           plate.barcode, 
                           decode(plate.pty_id, 1,127, 7,133, -1),  /* plate type translation */
                           decode(plate.sst_id, 1,37, 2,38, -1),   /* store status translation */
                           /* plate position id determined by corresponding slot and rack (rack determined by corresponding stack/shelf position) */
                           (select pr.id from plate_position_rrack@remp pr where pr.slot = plate.vps_pos_in_sr and pr.rra_id = (select r.id from rrack@remp r join rrack_position@remp rp on r.default_rpo_id = rp.rpo_id join shelf@remp s on s.rpo_id = rp.rpo_id join shelf_position_stack@remp sps on s.spo_id = sps.id join stack@remp st on st.id = sps.stk_id where plate.vps_level_nr = sps.level_number and plate.vps_row_nr = st.logical_id)),
                           plate.date_stored, plate.last_checked_in, plate.last_checked_out, null, null, plate.owner, plate.llk_proved, null, null, plate.mut_user, plate.mut_datetime, plate.mut_counter);
  end loop;
  
  -- insert tubes 
  for tube in (select * from tube@productionremp where pla_id in (select id from plates_to_migrate)) loop
    insert into tube@remp values (
                          tube.id, 
                          tube.barcode, 
                          tube.pla_id, 
                          133, /* plate type id */
                          28,  /* tube type id */
                          19,  /* cap type id */
                          tube.position, 
                          null, null, tube.date_stored, tube.last_checked_out, tube.last_checked_in, null, tube.owner, tube.mut_datetime, tube.mut_counter, tube.mut_user);
  end loop;
  
  
  --50 empty transfer racks
  for i in 1..50 loop
    select s.rpo_id into found_id from shelf@remp s join shelf_position_stack@remp sps on s.spo_id = sps.id join stack@remp st on st.id = sps.stk_id where st.logical_id = 4 and sps.level_number = i;
    insert into rrack@remp values ((select max(id) + 1 from rrack@remp), 'CHOPMTR' || lpad(i, 2, '0'), found_id, 199, null, null, null, 1, sysdate, 'MSS');
    for j in 1..8 loop
      insert into plate_position@remp values ((select max(ppo_id)+ 1 from plate_position@remp), 1, sysdate, 'MSS', 0);
      insert into plate_position_rrack@remp values ((select max(ppo_id) from plate_position@remp), (select max(id) from rrack@remp), j, 1, sysdate, 'MSS');
    end loop;
  end loop;
  
  -- 25 racks in ECB with 8 empty plates each
  for i in 1..25 loop
    select s.rpo_id into found_id from shelf@remp s join shelf_position_stack@remp sps on s.spo_id = sps.id join stack@remp st on st.id = sps.stk_id where st.logical_id = 1 and sps.level_number = ((i*2)-1);
    insert into rrack@remp values ((select max(id) + 1 from rrack@remp), 'CHOPTRR' || lpad(i, 2, '0'),  found_id, 201, null, null, null, 1, sysdate, 'MSS');
    for j in 1..8 loop
      insert into plate_position@remp values ((select max(ppo_id)+1 from plate_position@remp), 1, sysdate, 'MSS', 0);
      insert into plate_position_rrack@remp values ((select max(ppo_id) from plate_position@remp), (select max(id) from rrack@remp), j, 1, sysdate, 'MSS');
      insert into plate@remp values ((select max(id)+1 from plate@remp), (i*1000000) + j, 'ECB' || lpad(i, 2, '0') || lpad(j, 2, '0'), 133, 37, 
        (select pr.id from plate_position_rrack@remp pr where pr.slot = j and pr.rra_id = (select r.id from rrack@remp r join rrack_position@remp rp on r.default_rpo_id = rp.rpo_id join shelf@remp s on s.rpo_id = rp.rpo_id join shelf_position_stack@remp sps on s.spo_id = sps.id join stack@remp st on st.id = sps.stk_id where sps.level_number = ((i*2)-1) and st.logical_id = 1)),
        sysdate, null, null, null, null, 'LIMSON', null, null, null, 'MSS', sysdate, 1);
    end loop;
  end loop;
  
  -- fill some remaining rack positions with empty storage racks
  --for pos in (select rpo_Id from rrack_position@remp where rpo_id not in (select rpo_id from rrack@remp) and rownum < 100) loop
  --  select max(id)+1 into found_id from rrack@remp;
  --  insert into rrack@remp values (found_id, null, pos.rpo_id, 201, found_id, null, null, 1, sysdate, 'MSS');
  --end loop;
  
  commit;
end;
/
```

Run the following query, which will query the newly migrated data in the simulator database to create text formatted for pre-loading the simulator software:

```sql
select script from ( 
--EMPTY ECB PLATES ON STORAGE RACKS
select 0 order1, to_char(lpad(vps_level_nr, 3, '0')) order2, null order3, 
  '1:ECB_PLATE_MIC_AISLE_1:' || vps_row_nr || ':' || vps_level_nr || ':RANGE60(SRACKP_8.NULL{' || listagg(upper(vps_plate_type) || '.' || vps_plate_code, ',') within group (order by vps_pos_in_sr) || '})' script
from vsas_plates_in_store@remp
where vps_row_nr = 1
group by vps_row_nr, vps_level_nr
union
--EMPTY TRANSFER RACKS
select 2, to_char(lpad(sps.level_number, 2, '0')), null, 
  '1:ECB_RACK_PLATE_AISLE_1:' || st.logical_id || ':' || sps.level_number || ':RANGE30(TRACKP_8.' || r.barcode || '{})' script
from rrack@remp r 
join shelf@remp s on s.rpo_id = r.default_rpo_id 
join shelf_position_stack@remp sps on s.spo_id = sps.id 
join stack@remp st on st.id = sps.stk_id
where st.logical_id = 4
union
--PLATES
select 4, to_char(lpad(vps_row_nr, 3, '0')), to_char(lpad(vps_level_nr, 3, '0')), 
  '1:AREA_PLATE_MIC_ROBOT1_1:' || vps_row_nr || ':' || vps_level_nr || ':RANGE60(SRACKP_8.NULL{' || listagg(upper(vps_plate_type) || '.' || vps_plate_code, ',') within group (order by vps_pos_in_sr) || '})' script
from vsas_plates_in_store@remp
where vps_row_nr > 1
group by vps_row_nr, vps_level_nr
union
--TUBES
select 6, p.vps_plate_code, null, 
  'TUBE:' || p.vps_plate_code || '(' || listagg(vts_pos_in_tbr, ',') within group (order by vts_pos_in_tbr) || ')'
from vsas_tubes_in_store@remp t join vsas_plates_in_store@remp p on t.vts_plate_id = p.vps_plate_id
group by p.vps_plate_code
union select 1, null, null, ' ' from dual
union select 3, null, null, ' ' from dual
union select 5, null, null, ' ' from dual
)
order by order1, order2, order3;
```

Copy the results of the above query and paste them into a text file.  Save this text file as:

```
JSC/com.remp.mss.simulator/bin/com/remp/mss/simulator/devices/configuration/StoreTaskConfiguration.txt
```

Run the following pl/sql block to migrate data from the REMP simulator database to the storage broker:

```sql
declare 
  stack_no NUMBER;
  level_no NUMBER;
  order_id NUMBER;
  plate_order_item_id NUMBER;
  tube_order_item_id NUMBER;
  order_guid VARCHAR2(40);
  order_type_id NUMBER;
  audit_type_id_create NUMBER;
  audit_type_id_modify NUMBER;
  module_id NUMBER;
  storage_id NUMBER;
  user_id NUMBER;
  priority NUMBER;
  plate_id NUMBER;
  plate_container_type_id NUMBER;
  tube_container_type_id NUMBER;
  width_pos INTEGER;
  length_pos INTEGER;
  sequential_pos INTEGER;
  broker_order_item_id_diff NUMBER;
begin

select broker_order_type_id into order_type_id from broker_order_type where name = 'External Store';
select storage_id into storage_id from storage where name = 'REMP Storage System';
select broker_user_id into user_id from broker_user where username = 'limson';
select default_order_priority into priority from broker_user bu join broker_user_storage bus on bu.broker_user_id = bus.broker_user_id join storage s on s.storage_id = bus.storage_id where s.name = 'REMP Storage System' and bu.username = 'limson';
select container_type_id into tube_container_type_id from remp_container_type where remp_type = 'TUBE' and default_type = 1;
select broker_audit_type_id into audit_type_id_create from broker_audit_type where name = 'Operation: Create Order';
select broker_audit_type_id into audit_type_id_modify from broker_audit_type where name = 'Operation: Modify Order';
select module_id into module_id from module where name = 'Administration Interface';

for remprow in (select distinct vps_row_nr, vps_level_nr from vsas_plates_in_store@remp order by 1, 2) loop
  stack_no := remprow.vps_row_nr;
  level_no := remprow.vps_level_nr;
  select broker_order_seq.nextval into order_id from dual;
  select regexp_replace(lower(rawtohex(sys_guid())), '([a-f0-9]{8})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{12})', '\1-\2-\3-\4-\5') into order_guid from dual;
  insert into broker_order (broker_order_id, broker_order_guid, broker_order_type_id, storage_id, broker_user_id , operator, priority, description, date_created, date_updated) values 
    (order_id, order_guid, order_type_id, storage_id, user_id, 'Data migration', priority, 'Data conversion: stack ' || lpad(stack_no, 3, '0') || ' level ' || lpad(level_no, 2, '0'), sysdate, sysdate);
    
  insert into broker_audit (datetime, broker_audit_type_id, module_id, broker_user_id, broker_order_id, storage_id, barcode, description)
    values (sysdate, audit_type_id_create, module_id, user_id, order_id, storage_id,  null, 'Order[' || order_guid || '] created via REMP data migration');
  
  for plate in (select * from vsas_plates_in_store@remp where vps_row_nr = stack_no and vps_level_nr = level_no) loop
    plate_id := plate.vps_plate_id;
    select broker_order_item_seq.nextval into plate_order_item_id from dual;
    select container_type_id into plate_container_type_id from remp_container_type where remp_name = plate.vps_plate_type;
    insert into broker_order_item (broker_order_item_id, broker_order_id, container_type_id, barcode, broker_order_item_status) values
      (plate_order_item_id, order_id, plate_container_type_id, plate.vps_plate_code, 'Stored');
      
    insert into broker_audit (datetime, broker_audit_type_id, module_id, broker_user_id, broker_order_id, storage_id, barcode, description) 
      values (sysdate, audit_type_id_modify, module_id, user_id, order_id, storage_id, plate.vps_plate_code, 'Requested: add container barcode [' || plate.vps_plate_code || '] to order [' || order_guid || ']');
    
    for tube in (select * from vsas_tubes_in_store@remp where vts_plate_id = plate_id order by vts_pos_in_tbr) loop
      select broker_order_item_seq.nextval into tube_order_item_id from dual;
      select width_position, length_position, sequential_position 
        into width_pos, length_pos, sequential_pos 
        from container_type_map 
        where container_type_id = tube_container_type_id 
        and parent_container_type_id = plate_container_type_id
        and length_label || width_label = tube.vts_pos_in_tbr;
      insert into broker_order_item (broker_order_item_id, broker_order_id, container_type_id, barcode, parent_broker_order_item_id, height_position, width_position, length_position, sequential_position, broker_order_item_status) values 
        (tube_order_item_id, order_id, tube_container_type_id, tube.vts_tube_code, plate_order_item_id, 1, width_pos, length_pos, sequential_pos, 'Stored');
        
      insert into broker_audit (datetime, broker_audit_type_id, module_id, broker_user_id, broker_order_id, storage_id, barcode, description) 
        values (sysdate, audit_type_id_modify, module_id, user_id, order_id, storage_id, tube.vts_tube_code, 'Requested: add container barcode [' || tube.vts_tube_code || '] to order [' || order_guid || ']');
    end loop;
  end loop;
  
  insert into broker_order_status (broker_order_id, date_changed, broker_order_status) values (order_id, sysdate, 'Completed');
end loop;

--discard overlapping item IDs
select broker_order_item_seq.nextval into plate_order_item_id from dual;
select max(max_id) - plate_order_item_id
  into broker_order_item_id_diff
  from (select max(vts_tube_id) max_id from vsas_tubes_in_store@remp
        union select max(vps_plate_id) from vsas_plates_in_store@remp);
        
if broker_order_item_id_diff <= 0 then return; end if;

for i in 0 .. broker_order_item_id_diff loop
  select broker_order_item_seq.nextval into plate_order_item_id from dual;
end loop;

commit;
end;
/
```

Run the "Start Store Simulator (Empty)" shortcut.