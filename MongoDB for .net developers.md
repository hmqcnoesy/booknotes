#MongoDB for .net developers

##1 Installing MongoDB

Never install the 32-bit Windows
version.  After installing on Windows,
add the path to mongo.exe (and mongod.exe)
to the system path.  And also create a 
directory at `c:\db\data`.


##2 Mongod.exe and mongo.exe

Run mongod to start the database.
Run mongo to start the interactive
shell.  The mongo shell by default
connects to the local MongoDB 
instance.

A MongoDB instance can contain 
multiple databases.  In the shell, to
list the available databases use

```javascript
show dbs
```

The output might look something like:

```
local  0.078GB
m101   0.078GB
test   0.078GB
```

Then to pick the database to interact
with:

```javascript
use m101
```

A database can contain multiple 
collections.  A collection is a container
used to collect similar documents.  To
view the collections in the database
being "used":

```javascript
show collections
```

The output might look like:

```
funnynumbers
hw1
people
system.indexes
```

The `db` object is a reference to the 
database being used, which has a property
for each collection in that db.  So for 
the example above, there are these properties:

 - `db.funnynumbers`
 - `db.hw1`
 - `db.people`

And each of those collection objects has 
methods to allow interaction with the 
collection.  For instance, the `.find()`
method will return all the documents in 
the collection:

```javascript
var allFunnyNumbers = db.funnynumbers.find();
```

The `find()` method takes an object as a first
parameter to specify property values to be matched
in the query:

```javascript
var matts = db.people.find({"name":"matt"});
```

Multiple properties can be used:

```javascript
var oldMatts = db.people.find({"name":"matt", "age":38});
```

All documents in MongoDB have a unique `_id`
property.  If none is specified when the document
is inserted, one is created automatically, using
a machine ID, process ID, and timestamp in order
to make a globally unique ID.

A second object parameter can be passed to `find()`
to specify the properties of the matching documents
to be returned:

```javascript
var agesOfBobs = db.people.find({"name":"bob"}, {"name": true, "_id": false });
```

The examples above match property values
precisely.  To match greater or less than,
use an object for a match value, whose properties
are operators, the values of which are the values
to be compared:

```javascript
var youngPeople = db.people.find({"age": { $lt: 30 }});
```

Above, the `$lt` operator specifies that only people
whose age is less than 30 should be returned.  The
following operators work in this fashion:

 - `$gt`
 - `$gte`
 - `$lt`
 - `$lte`

Multiple operators can be used as expected:

```javascript
var twentySomethings = db.people.find({"age": { $lt: 30, $gte: 20 }});
```

Like the `find()` method, the `findOne()` method
takes the same types of parameters to query a 
collection, but returns a single object.

The `$exists` operator can be used to query
for documents where a particular property is
defined:

```javascript
var peopleWithFavColor = db.people.find({favoriteColor: { $exists: true }});
```

(Or not defined, if the value for `$exists` is 
set to `false`)

Regex searches are supported (although
not always highly optimized):

```javascript
db.people.find({name: { $regex: "^A" } });
```

The `$or` operator can allow multiple
criteria in an array:

```javascript
db.people.find({$or:[{name:"Jones"},{age: 25}]});
```

The `$and` operator works similarly:

```javascript
db.people.find({$and:[{name:"Jones"},{age: 25}]});
```

But the `$and` operator is much less
useful, because:

```javascript
db.people.find({name:"Jones",age:25});
```

Note that the following:

```javascript
db.people.find({age: {$gt: 25}, age: {$lt: 35}}):
```

will find people under age 35, **not**
people between 25 and 35.  This is 
because the query engine will overwrite
the first age criteria with the second.
To acheive the "between" query:

```javascript
db.people.find({age: {$gt: 25, $lt:35}});
```

To query for documents with arrays:

```javascript
db.people.insert({name:"Howard", favs:["pretzels","beer"]});
db.people.insert({name:"George", favs:["almonds","milk"]});

db.people.find({favs: "almonds"});
```

Surprisingly, the query above returns the
George document.  The query engine first
looks for documents having a "favs" property
with a string value of "almonds", then
looks for documents having a "favs" property
having an array value containing a string
element with value "almonds".

The `$all` operator queries for documents
where the specified property contains all
of the specified values:

```javascript
db.people.insert({name:"Howard", favs:["pretzels","beer"]});
db.people.insert({name:"George", favs:["almonds","milk"]});
db.people.insert({name:"Bob", favs:["cheese","beer"]});
db.people.insert({name:"Joe", favs:["almonds","beer", "cheese"]});
db.people.insert({name:"Frank", favs:["milk", "bread", "almonds"]});

db.people.find({favs: { $all: ["almonds", "milk"]});
```

The above query returns Frank and George.