# REMP Migration 

Login to the REMP Simulator VM.  Close the simulator and any running simulator-related programs.  
Double-click the "Start Store Simulator (Demo content)" shortcut on the desktop.
Wait for the "Store Simulator" window to open, at which point all of the REMP simulator data will have been 
restored to a baseline state.  Close the Store Simulator and associated command window.

Login to the broker database as broker_admin.  Then you'll have access to dblinks to both the simulator database (`@remp`) and the production database (`@productionremp`).

If desired, change the definition of the `broker_admin.plates_to_migrate` view.  This view is used by the migration procedure to determine which production plates to migrate.  For example, a small partial migration might include just the plates stored in stack 19:

```sql
create or replace force view "BROKER_ADMIN"."PLATES_TO_MIGRATE" ("ID", "EXT_ID", "BARCODE", "AISLE", "STACK", "LEVEL_NUMBER", "SLOT", "RACK_ID") AS 
select p.id, p.ext_id, p.barcode, a.logical_id aisle, st.logical_id stack, sps.level_number, ppr.slot, r.id rack_id
from plate@productionremp p
join plate_position_rrack@productionremp ppr on p.ppo_id = ppr.id
join rrack@productionremp r on r.id = ppr.rra_id
join shelf@productionremp s on s.rpo_id = r.rpo_id
join shelf_position_stack@productionremp sps on sps.id = s.spo_id
join stack@productionremp st on st.id = sps.stk_id
join aisle@productionremp a on a.id = st.ais_id
where st.logical_id = 19;
```

(A full migration would include everything with a stack logical ID greater than 4).

Run the following pl/sql procedure to copy production data to the simulator database.
This procedure will add 40 more transfer racks to the ECB (on top of the 10 placed there by running the demo content shortcut),
and will add 200 empty plates into the ECB (placed in the racks already in place by running the demo content shortcut).
It will copy racks/plates/tubes from production that are specified in the `plates_to_migrate` view.
It is best to run the procedure after hours, which will reduce the chance of any errors due to production data changes during 
execution.  If execution fails due to production data changes, perform a rollback and try it again. 

```sql
declare
  next_rra_id INTEGER;
  next_rpo_id INTEGER;
  next_ppo_id INTEGER;
  next_ppr_id INTEGER;
  next_pla_id INTEGER;
begin

  -- demo script places only 10 empty transfer racks into ECB (stack 4).  Add 40 more TRACKPs to ECB 
  for i in 11..50 loop
    select s.rpo_id into next_rpo_id from shelf@remp s join shelf_position_stack@remp sps on s.spo_Id = sps.id join stack@remp st on st.id = sps.stk_id where st.logical_id = 4 and sps.level_number = i;
    select s_rra_id.nextval@remp into next_rra_id from dual;
    insert into rrack@remp values (next_rra_id, '00REMP' || i, next_rpo_id, (select id from rrack_type@remp where name = 'TRACKP_8'), null, null, null, 1, sysdate, 'MSS');
    for j in 1..8 loop
      select s_ppo_id.nextval@remp into next_ppo_id from dual;
      insert into plate_position@remp values (next_ppo_id, 1, sysdate, 'MSS', 0);
      insert into plate_position_rrack@remp values (next_ppo_id, next_rra_id, j, 1, sysdate, 'MSS');
    end loop;
  end loop;
  
  -- demo script doesn't place any empty plates into ECB.  Add 200 so they don't have to be added manually thru sim software
  for i in 1..49 loop
    if mod(i,2) = 0 then continue; end if;    
    for j in 1..8 loop
      select ppr.id into next_ppr_id from plate_position_rrack@remp ppr join rrack@remp r on r.id = ppr.rra_id join shelf@remp s on s.rpo_id = r.rpo_id join shelf_position_stack@remp sps on sps.id = s.spo_id join stack@remp st on st.id = sps.stk_id where st.logical_id = 1 and sps.level_number = i and ppr.slot = j;
      select s_pla_id.nextval@remp into next_pla_id from dual;
      insert into plate@remp values (next_pla_id, -next_pla_id, 'EMPTY' || lpad(((i-1)*8)+j,3,'0'), (select id from plate_type@remp where name = 'TBR96'), (select id from storage_state@remp where name = 'EMPTY'), next_ppr_id, sysdate, null, null, null, null, 'MR.LIMSON', 0, null, null, 'MSS', sysdate, 1);
    end loop;
  end loop;

  -- rrack
  for rack in (select r.*, st.logical_id, sps.level_number 
               from rrack@productionremp r join shelf@productionremp s on s.rpo_id = r.default_rpo_id 
               join shelf_position_stack@productionremp sps on sps.id = s.spo_Id 
               join stack@productionremp st on st.id = sps.stk_id 
               where r.id in (select rack_id from plates_to_migrate)) loop

    select s.rpo_id into next_rpo_id from shelf@remp s join shelf_position_stack@remp sps on s.spo_id = sps.id join stack@remp st on st.id = sps.stk_id where st.logical_id = rack.logical_id and sps.level_number = rack.level_number;
    select s_rra_id.nextval@remp into next_rra_id from dual;
    insert into rrack@remp values (next_rra_id, rack.barcode, next_rpo_id, decode(rack.rty_id, 1,199, 3,201, -1), next_rpo_id, null, null, rack.mut_counter, rack.mut_datetime, rack.mut_user);
    
    -- each new rrack needs 8 plate_position records and 8 plate_position_rrack recrods
    for i in 1..8 loop
      select s_ppo_id.nextval@remp into next_ppo_id from dual;
      insert into plate_position@remp values (next_ppo_id, 1, sysdate, 'MSS', 0);
      insert into plate_position_rrack@remp values (next_ppo_id, next_rra_id, i, 1, sysdate, 'MSS');
    end loop;
  end loop;

  -- plates 
  for plate in (select p.*, ps.vps_row_nr, ps.vps_level_nr, ps.vps_pos_in_sr, pt.name plate_type, ss.name storage_state
                from plate@productionremp p 
                join vsas_plates_in_store@productionremp ps on p.ext_id = ps.vps_plate_id 
                join plate_type@productionremp pt on p.pty_id = pt.id
                join storage_state@productionremp ss on p.sst_id = ss.id
                where p.id in (select id from plates_to_migrate)) loop
    select s_pla_id.nextval@remp into next_pla_id from dual;
    insert into plate@remp values (
                           next_pla_id, 
                           plate.ext_id, 
                           plate.barcode, 
                           (select id from plate_type@remp where name = plate.plate_type),
                           (select id from storage_state@remp where name = plate.storage_state),
                           /* plate position id determined by corresponding slot and rack (rack determined by corresponding stack/shelf position) */
                           (select pr.id from plate_position_rrack@remp pr where pr.slot = plate.vps_pos_in_sr and pr.rra_id = (select r.id from rrack@remp r join rrack_position@remp rp on r.default_rpo_id = rp.rpo_id join shelf@remp s on s.rpo_id = rp.rpo_id join shelf_position_stack@remp sps on s.spo_id = sps.id join stack@remp st on st.id = sps.stk_id where plate.vps_level_nr = sps.level_number and plate.vps_row_nr = st.logical_id)),
                           plate.date_stored, plate.last_checked_in, plate.last_checked_out, null, null, plate.owner, plate.llk_proved, null, null, plate.mut_user, plate.mut_datetime, plate.mut_counter);
    insert into tube@remp select 
                          tube.id, 
                          tube.barcode, 
                          next_pla_id, 
                          (select id from plate_type@remp where name = pt.name), 
                          (select id from tube_type@remp where name = tt.name),
                          (select id from cap_type@remp where name = ct.name),  
                          tube.position, 
                          tube.handling_position, tube.handling_rob_id, tube.date_stored, tube.last_checked_out, tube.last_checked_in, tube.req_tube_id, tube.owner, tube.mut_datetime, tube.mut_counter, tube.mut_user
                          from tube@productionremp tube
                          join plate_type@productionremp pt on tube.pty_id = pt.id
                          join tube_type@productionremp tt on tube.tty_id = tt.id
                          join cap_type@productionremp ct on tube.cty_id = ct.id
                          where tube.pla_id = plate.id;
  end loop;

  commit;
end;
/
```

Run the following query, which will query the newly migrated data in the simulator database to create text formatted for pre-loading the simulator software:

```sql
with plate_names as (
    select ppr.rra_id, listagg(nvl2(p.barcode, pt.name || '.' || p.barcode, 'EMPTY'), ',') within group (order by ppr.slot) info
    from plate@remp p 
    join plate_type@remp pt on pt.id = p.pty_id
    right outer join plate_position_rrack@remp ppr on ppr.id = p.ppo_id
    group by ppr.rra_id)
select script from ( 
--ECB STORAGE RACKS WITH OR WITHOUT EMPTY PLATES
select 2 order1, to_char(lpad(st.logical_id, 3, '0')) order2, to_char(lpad(sps.level_number, 3, '0')) order3, 
  '1:ECB_PLATE_MIC_AISLE_1:' || st.logical_id || ':' || sps.level_number|| ':RANGE60(SRACKP_8.NULL{' || (select listagg(upper(pt.name) || '.' || p.barcode, ',') within group (order by ppr.slot) || '})' from plate@remp p join plate_type@remp pt on p.pty_id = pt.id join plate_position_rrack@remp ppr on p.ppo_id = ppr.id where ppr.rra_id = r.id) script
from rrack@remp r 
join shelf@remp s on s.rpo_id = r.rpo_id 
join shelf_position_stack@remp sps on s.spo_id = sps.id 
join stack@remp st on st.id = sps.stk_id
where st.logical_id in (1,3)
union
--EMPTY TRANSFER RACKS
select 0, to_char(lpad(st.logical_id, 3, '0')), to_char(lpad(sps.level_number, 3, '0')),  
  '1:ECB_RACK_PLATE_AISLE_1:' || st.logical_id || ':' || sps.level_number || ':RANGE30(TRACKP_8.' || r.barcode || '{})'
from rrack@remp r 
join shelf@remp s on s.rpo_id = r.rpo_id 
join shelf_position_stack@remp sps on s.spo_id = sps.id 
join stack@remp st on st.id = sps.stk_id
where st.logical_id in (2,4)
union
--PLATES
select 4, to_char(lpad(st.logical_id, 3, '0')), to_char(lpad(sps.level_number, 3, '0')), 
  '1:AREA_PLATE_MIC_ROBOT1_1:' || st.logical_id || ':' || sps.level_number || ':RANGE60(SRACKP_8.NULL{' || pn.info || '})' script
from plate@remp p
join plate_position_rrack@remp ppr on p.ppo_id = ppr.id
join rrack@remp r on r.id = ppr.rra_id
join shelf@remp s on s.rpo_id = r.rpo_id
join shelf_position_stack@remp sps on sps.id = s.spo_id
join stack@remp st on st.id = sps.stk_id
join plate_names pn on r.id = pn.rra_id
where st.logical_id > 4
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
C:\Workspace\JSC\com.remp.mss.simulator\bin\com\remp\mss\simulator\devices\configuration\StoreTaskConfiguration.txt
```

If starting a clean slate in the broker database, run the following to delete all "dynamic" broker data:

```sql
alter table REMP_VASS_PLATE	disable constraint REMP_VASS_PLATE_ORDER_ITEM_FK;
alter table broker_order_item disable constraint BROKER_ORDER_ITEM_FK3;
delete from remp_vass_tube;
delete from remp_vass_plate;
truncate table broker_order_item_history;
delete from broker_order_status_history;
delete from broker_order_history;
truncate table broker_order_item;
delete from broker_order_status;
delete from broker_order;
alter table REMP_VASS_PLATE	enable constraint REMP_VASS_PLATE_ORDER_ITEM_FK;
alter table broker_order_item enable constraint BROKER_ORDER_ITEM_FK3;
commit;
```

Then run the following pl/sql block to migrate data from the REMP simulator database to the storage broker:

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

Restart the Broker Storage Agent service, as it has lost communication with the Oracle database.

Run the "Start Store Simulator (Empty)" shortcut.  When the Store Simulator window appears, run the "Start Server (REMP-ASS API)" shortcut.
When you see `StartServer :V: Server started` in the command window, run the "Start JSC Client" shortcut.  Login as mss.  In the "SERVICE" 
tab, go to "Store Management" and click the button with two triangles at the bottom of the window (button tooltip is "Initialize the Aisle".  
In the window that appears, click the Start button and wait to see the message "END_INITIALIZATION", then click the Close button.  Finally,
click the button with the two arrows at the bottom of the current window (button tooltip is "Start Store & Deliver Mode").