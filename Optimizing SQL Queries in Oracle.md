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

##SQL Optimization

Restrict the number of columns listed in 
`SELECT` clauses, and avoid `SELECT *`.

Avoid implicit conversions such as 
`WHERE COL_DT = '01Jan2010'`.  Instead, 
prefer explicit conversions or exact literals.

It is possible to get a list of common values
found in two tables using an inner join.  For
instance:

```sql
SELECT DISTINCT A.THING_ID
FROM TABLE1 A INNER JOIN TABLE2 B
	ON A.THING_ID = B.THING_ID
```
A faster method to get the same info would be 
to use `INTERSECT`:

```sql
SELECT THING_ID
FROM TABLE1
INTERSECT
SELECT THING_ID
FROM TABLE2
```

Note that `INTERSECT` automatically performs a
`DISTINCT` operation.  The speed difference 
between the two queries above can be dramatic.

Likewise `MINUS` can be used in place of joins
to get speed increases when querying for data 
found in one table but not another (and `MINUS`
also performs a `DISTINCT` operation automatically):

```sql
SELECT THING_ID
FROM TABLE1
MINUS
SELECT THING_ID
FROM TABLE2
--returns thing_id values in table1 not found in table2
```

A correlated subquery is one in which the subquery
makes use of values from the outer query, such as

```sql
SELECT T.THING_ID
FROM TABLE1 T
WHERE T.SOMEVALUE IN (
	SELECT OTHER_VALUE
	FROM OTHER_TABLE O
	WHERE O.SOMETHING = T.SOMETHING);
```

Avoid these types of correlated subqueries where possible.
They cause the SQL engine to performs loops on retrieved
data and generally perform poorly.  Try rewriting these
types of queries.

The `IN` operator takes a list of values or a query 
as an argument.  It can sometimes be replaced with
the `EXISTS` keyword, which returns true immediately when
any row is found matching the subquery.  In general,
use `IN` when the subquery result set is small compared
to the outer query result set and use `EXISTS` when 
the subquery result set is large compared to the outer
query result set.

The Oracle multi-column `IN` generally performs slightly 
faster than corresponding `AND`s and `OR`s.  For example:

```sql
SELECT SOMETHING
FROM SOMETABLE
WHERE 
(COL1 = 'A' AND COL2 = 'X' AND COL3 = 70) OR
(COL1 = 'B' AND COL2 = 'Y' AND COL3 = 80) OR
(COL1 = 'C' AND COL2 = 'Z' AND COL3 = 90)
```

The above query can be rewritten in a more readable and
(slightly) better performing manner:

```sql
SELECT SOMETHING
FROM SOMETABLE
WHERE COL1, COL2, COL3 IN (
	('A', 'X', 70),
	('B', 'Y', 80),
	('C', 'Z', 90)
)
```

The `WITH` clause (aka subquery factoring clause)
allows subqueries to be broken out of the containing
outer query, and can be used to increase readability
as well as performance.  The `WITH` clause is especially
helpful for performance when it factors out a subquery
that is used more than one time:

```sql
SELECT SOMETHING
FROM SOMETABLE
WHERE SOMEVALUE IN (SELECT SOMEVALUE FROM SOMETABLE2 WHERE ...)
AND SOMEVALUE2 NOT IN (SELECT SOMEVALUE FROM SOMETABLE2 WHERE ...);

--CAN BE REWRITTEN
WITH VW AS (SELECT SOMEVALUE FROM SOMETABLE2 WHERE ...)
SELECT SOMETHING
FROM SOMETABLE
WHERE SOMEVALUE IN (SELECT * FROM VW)
AND SOMEVALUE2 NOT IN (SELECT * FROM VW);
```

Oracle allows the `APPEND` hint when inserting records to 
instruct the database to insert records at new locations
on disk rather than looking for deleted record locations 
where the new records can be inserted.  Note the exact
syntax required for the hint to work correctly:

```csharp
using (var connection = new OracleConnection())
{
	connection.Open();
	var sql = "INSERT /*+ APPEND */ INTO TABLE VALUES (:IN1, :IN2)";
	for (var i = 0; i < 100000; i++)
	{
		var cmd = new OracleCommand(sql, connection);
		cmd.Parameters.AddWithValue(":IN1", 1);
		cmd.Parameters.AddWithValue(":IN2", 2);
		cmd.ExecuteNonQuery();
	}
}

```

Use the `ON` syntax for joining rather than joins within
the `WHERE` clause.  Make sure you optimize queries using
`ON` joins by listing smaller data sets first.  For
example:

```sql
SELECT A.COL1, B.COL1
FROM LITTLETABLE A INNER JOIN BIGTABLE B
	ON A.ID = B.ID
WHERE A.SOMETHING = 'SOMEVALUE'
```

Although when properly indexed, the above example would be
equally fast when listing the big table first.

##Indexes

Indexes are most useful when the returned data constitutes 
about 15% or less of the total rows of the table.  If
the returned data comprise more than about 15%, Oracle
may ignore indexes and perform a full table scan anyway.

Indexes can result in slower data updates because not only
does a table's data have to be modified, but the index or 
indexes must be modified as well.

###B-Tree Indexes
A B-Tree index can be applied to any data type and can
be applied to one or multiple columns. In a B-Tree index,
the index entries point to specific row IDs for the table.
When mutliple columns are indexed together, an index entry
for one of the column values points to other index entries
that contain the corresponding values of the other column.
Those entries in turn point to the corresponding row IDs
in the table.

###Bitmap Indexes
Similar in functionality to B-Tree indexes, but stored very
differently.  A bitmap index is stored as a series of 1s and 0s
indicated exclusion and inclusion of each particular row.
A bitmap index is appropriate when the number of distinct values
being indexed is much smaller than the total number of rows.  
For example, if a table had millions of rows and a column 
indicating gender using 'M' or 'F', and we needed an index 
on the gender column to make filtering on gender a fast 
operation, a bitmap index would be an appropriate choice
because 2 << Millions.  In this example, the bitmap index would
have an 'M' entry and an 'F' entry.  For each of the two entries,
a stream of millions of 1s and 0s would be stored, indicating 
whether each row of the table matches the value of the index
entry or not.  Bitmap indexes perform best in
situations where the data are not updated very frequently.

###Function-based indexes
Function-based indexes allow functions to be performed on
indexed data where indexes would otherwise be ignored
because queries perform functions on data would eliminate
the applicability of an index.  For example, querying
on a "last name" column using `UPPER(LAST_NAME) = :LAST_NAME`
would not make use of a regular index on the last_name column.
However, a function-based index could be created that indexes
`UPPER(LAST_NAME)` so that whenever a query uses *exactly*
the same function, the index can be used.

###Bitmap Join Indexes
A bitmap join index performs an inner join between two tables and 
stores the join info as an index.