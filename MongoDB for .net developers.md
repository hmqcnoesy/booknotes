#MongoDB for .net developers

##1 Installing MongoDB

Never install the 32-bit Windows
version.  After installing on Windows,
add the path to mongo.exe (and mongod.exe)
to the system path.  And also create a 
directory at `c:\data\db`.


##2 Mongod.exe and mongo.exe

###Using document databases

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

 
###Inserting documents

To insert a document into a collection, use
the `insert()` method on the collection:

```javascript
db.people.insert({name: "Matt", age: 38});
```

If the document object doesn't explicitly
specify an `_id` property, one is generated
by the database.  All documents in MongoDB have 
this unique `_id` property.  For automatic
generation, MongoDB uses a machine ID, process 
ID, and timestamp so the value should be
globally unique.


###Querying documents

Each of the collection objects above has 
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

Regex queries are supported (although not highly
optimizable):

```javascript
db.people.find({name: { $regex: "e$" }});
db.people.find({name: { $regex: "^A" }});
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
db.people.insert({name:"Bob",    favs:["cheese","beer"]});
db.people.insert({name:"Joe",    favs:["almonds","beer", "cheese"]});
db.people.insert({name:"Frank",  favs:["milk", "bread", "almonds"]});

db.people.find({favs: { $all: ["almonds", "milk"]});
```

The above query returns Frank and George.

The `$in` operator can be used to query 
arrays, which matches any of the specified
values (as opposed to `$all` which matches 
all):

```javascript
db.people.insert({name:"Howard", favs:["pretzels","beer"]});
db.people.insert({name:"George", favs:["almonds","milk"]});
db.people.insert({name:"Bob",    favs:["cheese","beer"]});
db.people.insert({name:"Joe",    favs:["almonds","beer", "cheese"]});
db.people.insert({name:"Frank",  favs:["milk", "bread", "almonds"]});

db.people.find({favs: { $in: ["almonds", "milk"]});
```

The above query returns the George, Joe,
and Frank documents.

Nested documents can be queried where the 
*exact* subdocument is specified, including
the *order* of the properties as they were
specified when inserted:

```javascript
db.people.insert({name: "me", email: {personal: "me@me.com", work: "me@work.com" }});

db.people.find({email: {personal: "me@me.com"}});
// nothing returned

db.people.find({email: {personal: "me@me.com", work:"me@work.com"}});
// returns the "me" document

db.people.find({email: {work: "me@work.com", personal:"me@me.com"}});
// nothing returned!!!
```

Well, that sucks.  To query a nested subdocument
it is usually more usefull to use the `.`
notation:

```javascript
db.people.insert({name: "me", email: {personal: "me@me.com", work: "me@work.com" }});

db.people.find({"email.work": "me@work.com"});
// returns the "me" document
```

The `find()` method returns a cursor object,
which has methods such as `hasNext()` and
`next()`, which is not terribly usefuly in
the shell, but more useful in a programmatic
context:

```javascript
var cur = db.people.find();
while(cur.hasNext()) cur.next();
```

The above is acutally the default behavior 
of the shell for printing out the results
of a query.

The cursor object that is returned by `find()`
is lazy: no querying is done until the 
results of the query are accessed.  Here
the extra `null;` statement prevents the 
shell from printing out the query results,
so the query is not executed - instead, the
cursor object is returned only:

```javascript
var cur = db.people.find(); null;
cur.limit(5); null;
```

Once the query results are accessed, the 
specified limit value is sent as part 
of the query to the database.

The methods on a cursor object return 
the cursor itself.  Only the interactive 
shell's behavior of by default displaying
the query results causes the query to be
executed.  So the `sort()` method takes an 
object to specifying sorting, but returns
the cursor it is called on so as to prevent
the query execution:

```javascript
var c = db.people.find(); null;
c.sort({ name: -1 }); null;
while (c.hasNext()) printjson(c.next());
``` 

So chaining is possible, all of which is
done by the database, never by the client:

```javascript
db.people.find().sort({name: -1}).limit(3).skip(2);
```

Counting results can be done using the
`count()` method:

```javascript
db.people.count({name: {$regex: "^m"}});
```


###Updating documents

The collection's `update()` method take
at least two arguments, the first of which
is the query, just like the `find()` method, 
and the second of which is an object specifying
an object to **replace** the matching document
(only the `_id` is not replaced):

```javascript
db.people.update({name:"me"}, {name:"Me", salary: 30});
```

Using the `$set` command with update can be used with
the `update()` method to prevent the wholesale
replacement behavior:

```javascript
db.people.update({name:"me"}, {$set: {luggageCode: "12345"}});
```

The above line will update an existing 
property's value, or add the property
if it doesn't already exist.

Similarly, the `$inc` operator will increment
a numeric property value by a step value:

```javascript
db.people.update({name:"me"}, {$inc: {age: 1}});
```

Similar to `$set` the `$unset` operator will 
remove the specified property from a document:

```javascript
db.people.update({name:"me", {$unset: {salary:1}});
```

Updating arrays within documents can be 
done using operators `$push` and `$pop`
which behave like their JavaScript 
counterparts:

```javascript
db.people.insert({_id: "me", numbers: [1,2,3,4,5]});
db.people.update({_id: "me"}, {$push:{numbers: 6}});

//pop the right-most element:
db.people.update({_id: "me"}, {$pop:{numbers: 1}});

//pop the left-most element:
db.people.update({_id: "me"}, {$pop:{numbers: -1}});
```

The `$pushAll` operator adds multiple values 
to an array:

```javascript
db.people.update({_id: "me"}, {$pushAll: {numbers: [7,8,9]}});
``` 

And the `$pull` operator removes a (single) element
from an array based on a matching value:

```javascript
db.people.insert({_id: "x", numbers: [3,4,5,6,7,6,5]});
db.people.update({_id: "x"}, { $pull: { numbers: 5}});
// numbers is now [3,4,6,7,6]
```

And the `$pullAll` operator removes elements
matching any values in a specified array:

```javascript
db.numbers.insert({_id:"y", numbers: [2,4,7,8,9]});
db.numbers.update({_id:"y"}, $pullAll: {numbers: [2,7,8]});
// numbers is now [4,9]
```

The handy `$addToSet` operator adds to an array
if the specified value is not found in the array,
or leaves it untouched if it is:

```javascript
db.numbers.insert({_id: "z", numbers: [2,4,6]});
db.numbers.update({_id: "z"}, { $addToSet: { numbers: 5}});
// numbers is [2,4,6,5]
db.numbers.update({_id: "z"}, { $addToSet: {numbers: 5}});
// numbers is still [2,4,6,5]
```

The `update()` method can also do an upsert by
specifying a third object parameters, with a
property named `upsert` and set to `true`.  If 
there is no document found matching the object
specified in the first parameter, a matching
document will be inserted instead of updated:

```javascript
db.names.update({name: "George"}, { $set: { age: 40 }}, {upsert: true});
```

The `update()` method by default updates only
**one** matching document.  In order to update
multiple documents, a third parameter object with
a property named `multi` must be set to true.  Here,
an empty object matches every document in the 
collection, which will all be updated with a title 
property:

```javascript
db.names.update({}, { $set: { title: "Dr" }}, { multi: true });
```

An operation that updates multiple documents
may pause to allow other read operations to 
proceed.  During the yielding, read operations
might read a half-finished update operation.
But read operations will never read a half-modified
individual document.


###Removing documents

To remove a document, use the `remove()` method
on a collection, which takes an argument like `find()`.
The `drop()` method might be more efficient than
`remove({})` but will lose any indexes created
on the collection. 

```javascript
db.names.remove({name:"Alice"});
//alice document was removed
db.names.remove({});
//all documents in names collection removed
db.names.drop();
//names collection is dropped, similar to removing all
```

Like update operations, remove operations may
yield to read operations, in which case the read
operation may read a state where some but not
all of the matched documents have been removed.
But any individual document will never be in a
strange partially deleted state.


###Using MongoDB driver for .NET

Use nuget to install the dependency to the
official package: "MongoDB.Driver".  This
package depends on "MongoDB.Driver.Core"
and "MongoDB.Bson" which are handled automatically
when adding the "MongoDB.Driver" package.

All operations in the MongoDB library are 
asynchronous by nature.  Create a `MongoClient`
object by passing the constructor a connection string.
The MongoClient handles all connections automatically.
So pooling is handled without need to dispose, and 
you can create as many client instances as needed.

From a client object, get a database object,
and from the database object, get a collection.
So a simple console app might look like:

```csharp
static void Main(string[] args) 
{
	MainAsync(args).Wait();	
}

static async Task MainAsync(string[] args) 
{
	var client = new MongoClient("mongodb://localhost:27017");
	var db = client.GetDatabase("dbname");
	var col = db.GetCollection<Person>("people");	
}
```

The driver can use strong types as in
the example above where a person object
is specified.  But a generic document
can also be used, which is defined by the
`BsonDocument` class:

```javascript
var doc = new BsonDocument 
{
	{"name", "matt"},
	{"age", 38}	
};

// add prop to the document programatically
doc.Add("fav", "almonds");

// or using the [] notation:
doc["profession"] = "hacker";

// nested document
var nested = new BsonArray();
nested.Add(new BsonDocument("color", "red"));
nested.Add(new BsonDocument("shape","circle"));
doc.Add("arr", nested);
```

In the case of a strongly typed treatment
of collection documents, a class can be 
written using conventions such as:

```csharp
public class Person 
{
	public ObjectId Id {get;set;}
	public string Name {get; set; }
	public int Age {get; set; }
	public List<string> Favs {get; set; }
	public List<Pet> Pets {get; set; }
	public BsonDocument ExtraElements {get; set; }	
}

public class Pet 
{
	public string Name {get; set; }
	public string Type {get; set; }	
}
```

The class above uses the convention of
an `ObjectId` type with field name `Id`.
The list of strings will be treated as
an array of strings, the list of pets will
be treated as an array of nested subdocuments,
and the `BsonDocument` is a catchall property
for extra attributes not defined in the
class explicitly.

Attributes can be added to properties to
define document behaviors.  For instance,
a `[BsonElement("name")]` attribute could be
placed on the `Name` property to force the 
database serialization to use a lowercase
`name` property.


###Inserting data with .NET driver

Simple insertion using the generic `BsonDocument`
type:

```csharp
var client = new MongoClient(_connectionString);
var db = client.GetDatabase("test");
var col = db.GetCollection<BsonDocument>("people");

var doc = new BsonDocument 
{
	{"Name","Smith"},
	{"Age",30},
	{"Profession","Hacker"}	
};

await col.InsertOneAsync(doc);
```

If two or more document objects were created, an array
can be created, e.g. `new [] {doc, doc2}` and
passed to the `InsertManyAsync()` method.

Using strongly-typed insertions are as easy:

```csharp
var client = new MongoClient(_connectionString);
var db = client.GetDatabase("test");
var col = db.GetCollection<Person>("people");

var person = new Person 
{
	Name = "Smith",
	Age = 30,
	Profession = "Hacker"
};

await col.InsertOneAsync(person);
```

Note that in the above code, before the 
call to `InsertOneAsync()` the `Id` property
is unintialized, but after the call, the
property has the value assigned in the database.
(However the client driver does the assigning,
not the database server).


###Finding documents using .NET driver

Use the `Find()` method:

```csharp
var client = new MongoClient(_connectionString);
var db = client.GetDatabase("test");
var col = db.GetCollection<BsonDocument>("people");

var list = await col.Find(new BsonDocument()).ToListAsync();
foreach (var doc in list) 
{
	//doc
}
```

To find using a filter:

```csharp
var filter = new BsonDocument("Name", "Smith");
var list = await col.Find(filter).ToListAsync();
foreach (var doc in list) 
{
	//doc	
}
```

More complicated queries might make use of
the `FilterDefinitionBuilder` type:

```csharp
var builder = Builders<BsonDocument>.Filter;
var filter = builder.Lt("Age", 30) & builder.Eq("Name", "Jones");
var list = await col.Find(filter).ToListAsync();
foreach (var doc in list) 
{
	//doc	
}
```

Notice above that the `&` and `|` operators have
been overloaded to function with expected 
behavior.

The `Find()` method uses a fluent interface:

```csharp
var list = await col.Find(filter)
					.Sort(new BsonDocument("Age", 1))
					.Limit(5)
					.Skip(25)
					.ToListAsync();
```

