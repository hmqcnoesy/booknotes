#Advanced SQL

## Analytic functions I

Aggregate functions like `count` and `sum` use a `group by` clause.  Analytic
functions don't use grouping, but perfrom `group by`-like summarizations in a 
non-sequential way. Unlike the aggregate functions, analytic functions do not 
modify the number of rows returned by a query.  Analytic functions are the
**last** SQL operation performed on a query, and they are performed on the 
results of the SQL query after the query has been executed and data have been
retrieved.  So an analytic function's operation is not affected by `group by`,
`having`, `where`,  etc.

The syntax of an analytic function is:

```sql
function (...) over (partition by col1, col2, ... order by col3, col4, ...  windowing_clause) as col_name
```


### Simple examples

```sql
CREATE TABLE CHILDSTAT(FIRSTNAME VARCHAR2(50),GENDER VARCHAR2(1),BIRTHDATE DATE,HEIGHT NUMBER,WEIGHT NUMBER);
INSERT INTO CHILDSTAT VALUES('ROSEMARY','F',DATE '2000-05-08',35,123);     
INSERT INTO CHILDSTAT VALUES('LAUREN','F',DATE '2000-06-10',54,876);     
INSERT INTO CHILDSTAT VALUES('ALBERT','M',DATE '2000-08-02',45,150);     
INSERT INTO CHILDSTAT VALUES('BUDDY','M',DATE '1998-10-02',45,189);   
INSERT INTO CHILDSTAT VALUES('FARQUAR','M',DATE '1998-11-05',76,198);     
INSERT INTO CHILDSTAT VALUES('TOMMY','M',DATE '1998-12-11',78,167);     
INSERT INTO CHILDSTAT VALUES('SIMON','M',DATE '1999-01-03',87,256);
```

Gives this table:

| FIRSTNAME | GENDER | BIRTHDATE | HEIGHT | WEIGHT |
| --------- | ------ | --------- | ------ | ------ |
| ROSEMARY	| F	     | 08-MAY-00 | 35     | 123    |
| LAUREN	| F	     | 10-JUN-00 | 54     | 876    |
| ALBERT	| M	     | 02-AUG-00 | 45     | 150    |
| BUDDY     | M      | 02-OCT-98 | 45     | 189    |
| FARQUAR	| M	     | 05-NOV-98 | 76     | 198    |
| TOMMY     | M      | 11-DEC-98 | 78     | 167    |
| SIMON     | M      | 03-JAN-99 | 87     | 256    |

```sql
select gender, count(*) from childstat group by gender
```

| GENDER | COUNT |
|-----|-----|
| M   | 5   |
| F   | 2   |

A non-anlytic method of getting the gender counts in the original table is messy:

```sql
select a.*, b.gender_counts
from childstat a inner join ( 
    select gender, count(*) as gender_counts
    from childstat
    group by gender) b on a.gender = b.gender;
```

| FIRSTNAME | GENDER | BIRTHDATE | HEIGHT | WEIGHT | GENDER_COUNT |
| --------- | ------ | --------- | ------ | ------ | ------------ |
| ROSEMARY	| F	     | 08-MAY-00 | 35     | 123    | 2            |
| LAUREN	| F	     | 10-JUN-00 | 54     | 876    | 2            |
| ALBERT	| M	     | 02-AUG-00 | 45     | 150    | 5            |
| BUDDY     | M      | 02-OCT-98 | 45     | 189    | 5            |
| FARQUAR	| M	     | 05-NOV-98 | 76     | 198    | 5            |
| TOMMY     | M      | 11-DEC-98 | 78     | 167    | 5            |
| SIMON     | M      | 03-JAN-99 | 87     | 256    | 5            |


The analytic function version of this is simpler:

```sql
select a.*, count(*) over (partition by a.gender) from childstat a;
```

Gives the same results as the non-analytic query above.

As another example, say we needed to get running totals of weight by gender:

```sql
select a.*, sum(weight) over (partition by a.gender order by a.weight) run 
from childstat a 
order by a.gender, a.weight;
```

| FIRSTNAME | GENDER | BIRTHDATE | HEIGHT | WEIGHT | RUN  |
| --------- | ------ | --------- | ------ | ------ | ---- |
| ROSEMARY	| F	     | 08-MAY-00 | 35     | 123    | 123  |
| LAUREN	| F	     | 10-JUN-00 | 54     | 876    | 999  |
| ALBERT	| M	     | 02-AUG-00 | 45     | 150    | 150  |
| BUDDY     | M      | 02-OCT-98 | 45     | 189    | 317  |
| FARQUAR	| M	     | 05-NOV-98 | 76     | 198    | 506  |
| TOMMY     | M      | 11-DEC-98 | 78     | 167    | 704  |
| SIMON     | M      | 03-JAN-99 | 87     | 256    | 960  |

In the query above, the `sum` function does what it always does, it sums values
across rows, but the `over` keyword changes it from an aggregate function to an
analytical function.  The `partition by` acts similarly to a `group by` in the 
sense that it specifies how the `sum` function is applied.  Remember that the
analytic function is executed against the resulting data after it has been
retrieved, and it doesn't alter the number of resulting rows.


### More on `partition by`

The `partion by` clause breaks up data into chunks (partitions) similar to a 
`group by` clause for aggregate functions.  Think of the first example like 
this (`select a.*, count(*) over (partition by a.gender) from childstat a;`):
the query without the analytic function `select * from childstat` 
returns all the table data.  Then the analytic function is performed, which 
partitions the resulting data into chunks by gender (in this case, there are 
2 resulting chunks, which are rows where gender is 'M' and rows where gender
is 'F').  Then the analytic function is performed on data within the chunks,
such that the operation is "re-initialized" as it crosses into each new chunk.
The result of the analtyic function for each chunk is then applied to each row.

The analytic functions available match all the aggregate functions (e.g. `sum`,
`min`, `max`, `count`, etc.) but additional functions are available as well (e.g.
`row_number`, `ratio_to_report`, etc.).

### Partition by examples



## Analytic functions II


## Analytic functions III


## Analytic functions IV

