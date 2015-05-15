#Oracle Performance Tuning for Developers

##Oracle Architecture and Performance Basics
Oracle consumes all memory available on a system that is not 
already in use by the OS.  The memory is used to cache data
and to have working memory room to efficiently perform joins
and sorts of data from SQL statements.

Oracle manages data contained within blocks, which are between
2 and 32 KB each, usually 8 KB.  Each block has a block header
of about 100 bytes, describing what kind of data are contained
in the block (table data vs index, etc) and metadata for the 
block such as a table name.  The rest of the block contains
the data itself, which might be rows from the table, as well
as some amount of free space between row data and at the end
of the block after all row data.  It is important to have
free space for a single row's data to expand into, and free
space at the end of the block to allow new rows to be created.
If insufficient free space is available in a block for these
operations, Oracle must rearrange data between blocks, which
is less efficient.

Oracle keeps a very large **Buffer Cache** of in-memory blocks, 
which it caches from disk.  To execute a SQL statement, 
Oracle first checks the Buffer Cache to see if the needed
blocks are available there.  If they are not, it will 
retrieve them from disk.  Blocks are moved in and out of the
Buffer Cache using a least-used-out algorithm.  The 
existence of the Buffer Cache is often evident when a SQL
select runs slowly once, but then faster if repeated soon
after.

When SQL commands are submitted to Oracle, before accessing
any block data, Oracle must check that tables, rows, and
other objects referenced in the SQL actually exist, and 
that the user has permission to them, and finally Oracle 
must create a plan for how it will execute the statement.
Similar to the data explicitly stored in the database, the
type of data created in this process can also be cached.
The caching of these types of data is done outside the 
Buffer Cache, in a location known as the **Shared Pool**.
Common data cached in the Shared Pool include object 
permissions, object definitions (column names, etc.), and
SQL statements with their execution plans.

Another memory chunk reserved by Oracle is known as the 
**Program Global Area**.  This contains session connection info,
a SQL work area (for sorting, joining, etc.) and a private 
SQL area storing the values of bind variables, etc.  Each
connection to Oracle creates its own space in the Program 
Global Area.  So limiting connection numbers to an Oracle 
database keeps more memory free to handle other operations.

The takeaways: 1) Oracle is memory-hungry 2) the more
memory you can give Oracle the better 3) caching is used
extensively and makes use of sophisticated algorithms to 
optimize the caching process 4) code should be written to
prefer memory cached operations over disk operations.


##Performance Metrics
**Elapsed time** is the most obvious, but not always the most
useful metric.  It isn't the most useful, because it cannot
tell you why a statement took as long as it did.

**Logical IO Operations** is a count of the number of read 
operations Oracle performs from the buffer cache.  If Oracle
needs a block that is not available in the Buffer Cache, an
additional **Physical IO Operation** will also be performed,
but the logical operation is counted as well.  Intuitively,
the more logical IO operations performed, the more CPU cycles
are consumed as a result.  And as the number of logical IO
operations increases, the likelihood of requiring physical IO
operations increases.  Another reason the logical IO operations
count is an important metric is that repeated runs of the 
same command will give a repeatable logical IO metric.  So the
metric can be considered independent of other loads on the
system.  Older Oracle documentation may refer to a logical IO
operation as a "consistent get".  Logical IOs can be measured
using Autotrace features in SQL*Plus and SQL Developer.  The
V$ Views (such as V$SqlStats) also summarize logical IOs and
can indicate which statements are most costly.

**CPU usage** in Oracle is mainly consumed by statement parsing
and processing.  It is common to see Oracle servers running at
80-90%.  Only when 100% is reached will some processes be
adversely impacted.


##Performance Tuning and Database Size
Performance tuning must be done in a database similar in size
to the production database in use.  Oracle creates execution
plans differently depending on the amount of data it is dealing
with, so tuning in a copy of a database with reduced data sets
likely will not translate into similar performance gains once
applied to the real production database.


##Connections and Connection Pools

A connection from an application to an Oracle database requires
a TCP handshake over the network, an allocation of memory in
the Program Global Area, and other associated overhead.  For 
this reason, it is wise to always use connection pooling in your
application.  When using pooling, your application keeps a quantity
of established physical connections to the Oracle database (a pool)
and when the application code requires a connection, instead of 
establishing a new physical connection, it checks out an existing, 
open connection from the pool.  When the application code is done
with the connection, rather than closing the connection, it simply 
returns it to the pool where it can await another use.  If the 
pool has all of its connections checked out when a request for 
another connection arrives, it simply creates new connections as 
needed and continues checking them out to consuming code.  When
extra unused connections are returned to the pool, excess connections
can be closed and removed from the pool to conserve resources
on the server side.

A separate connection pool is established for each connection string.
So multiple connection strings mean multiple connection pools. Each 
connection pool has a minimum and maximum number of allowed connections
as well as rules determining how many connections to open or close at a
time.

If the maximum number of connections for a pool has been reached and a
new connection is required from the pool, the requesting code will be
blocked until a connection is freed and returned to the pool.  If it 
waits too long (depending on the connection pool timeout specified in
the connection string) a timeout exception will be thrown.  As a 
general rule, do not do any non-database logic during the time that
a connection is checked out from the pool.  Get the connection from 
the pool, perform database operations, and return it to the pool.  Any
logic that can be performed without an open connection should be.
Avoid time-consuming code such as web service calls or file system 
access while a connection is open and checked out.

The difference between opening a connection to Oracle and checking out
an open connection from the pool can be dramatic.  A new physical 
connection can take 1 or 1.5 seconds to establish, whereas checking out
an open connection from the pool and making it available for use can 
take less than 1 ms.

Some important connection pooling parameters in .NET include (these
values are set directly in a connection string):
 - Pooling: turns pooling on or off (default is true)
 - Min Pool Size: minimum number of connections to keep alive (default 1)
 - Max Pool Size: maximum number of connections to keep alive (default 100)
 - Connection Timeout: seconds to wait for a free connection (default 15)
 - Incr Pool Size: number of connections to create at a time (default 5)
 - Decr Pool Size: number of connections to close at a time (default 1)
 
In .NET, `connection.Open()` checks out an open connection from the pool
and `connection.Close()` returns it to the pool.  In other words, 
connection pooling is automatic.  However, code like this results in two
connections being checked out from the pool:

```csharp
public List<Thing> GetThings() 
{
	using (var connection = new OracleConnection(constring)
	{
		connection.Open();
		// Do some database stuff
		var more = GetMoreThings();
	}
}

private List<Thing> GetMoreThings() 
{
	using (var connection = new OracleConnection(constring) 
	{
		connection.Open();
		// do more stuff
	}
}
```

A more effective use of database connection resources might look like:

```csharp
public List<Thing> GetThings() 
{
	using (var connection = new OracleConnection(constring)
	{
		connection.Open();
		// Do some database stuff
		var more = GetMoreThings(connection);
	}
}

private List<Thing> GetMoreThings(OracleConnection openConnection) 
{
	// do more stuff using openConnection instead of a new connection
}
```

In the above example, if `GetMoreThings` needed to be exposed as `public`
it might be best to do a method overload to handle those situations:

```csharp
public List<Thing> GetMoreThings() 
{
	using (var connection = new OracleConnection(constring) 
	{
		connection.Open();
		return GetMoreThings(connection);
	}
}
```


##Bind Variables