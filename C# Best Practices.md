# C# Best Practices

##Application Architecture

Non-trivial applications can be 
broken down into separate projects
for:

- UI (may have multiple UI projects
if multiple UIs are required)
- Common (functionality such as 
logging and emailing)
- Business (logic implementing
business rules of the application)
- DataAccess (logic for persisting
and retrieving data in a database)

UI projects have a dependency on
Business, which has a dependency 
on DataAccess.  Any project may
have a dependency on Common.


##Classes

Default accessibility modifier
for a class is `internal`.

The *members* of a class are
*fields*, *properties*, *methods*,
and *constructors*.

A class's *fields* are `private`
variables declared in the class to
hold an object's data.

A class's *properties* are getter
and setter methods that guard 
access to the object's *fields*.
*Automatic properties* allow the 
compiler to create `private`
*backing fields* at compile time.

A class's *methods* define the 
behavior or functionality of the 
object.  The default accessibility
of a method is `private`.

A class's *constructor(s)* are 
methods with the same name as the
class, having no return type, 
used to instantiate the class. 

Generally, the order of *members*
defined in a class are in order:

- Constructors
- Fields and Properties
- Methods
