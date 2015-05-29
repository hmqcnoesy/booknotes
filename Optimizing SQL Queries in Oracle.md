#Optimizing SQL Queries in Oracle

##Data Optimization
Fewer columns make faster queries because
smaller record sizes reduce the amount
of time required to scan through them
when performing a query.  For instance, a
query like the following:

```sql
SET TIMING ON
SELECT SUM(COL1) AS TOTAL
FROM TABLE_WITH_MANY_COLUMNS

------------------
TOTAL
27500000

ELAPSED: 00:00:09.993
```

Would undoubtedly take longer to execute 
than a similar query done against a table
containing the same number of rows with 
similar data, but with unnecessary columns
removed:

```sql
SET TIMING ON
SELECT SUM(COL1) AS TOTAL
FROM TABLE_WITH_FEW_COLUMNS

------------------
TOTAL
27500000

ELAPSED: 00:00:02.567
```

A simple query optimization is to 
eliminate unecessary columns from a
select clause.  `SELECT A, B, C` is
inherently faster than `SELECT *` and
has a maintainability benefit as well.
Likewise, if a column is truly not 
needed, don't include it in the table
design in the first place.  Wider tables
are slower, as described above.  If 
columns are necessary but used very 
infrequently, separate those columns out
into another table.  Fewer columns in 
a table will *always* be faster than 
the same table with extra columns.

If a null value appears in a column 
between two non-null values in adjacent
columns, Oracle uses a single null 
character to specify that null value.
However, if a null value is in a column that
is at the end of the record, or where all
columns to the right in that record contain
null values, Oracle can leave the null character
out and simply end the record.  Therefore 
it is most efficient to design tables such
that the column most likely to contain a 
null value is the right-most column in the 
table, and the second-most likely column to
have null values is the second-to-the-right,
and so on.  This technique will minimize
record size and result in faster queries.
