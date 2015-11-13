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

A class's *constructors* can call
each other using the syntax:

```csharp
public class Thing {
	public Thing() { ... }
	
	public Thing(string name) : this()
	{
		_name = name;	
	}	
}
```

The constructor referenced using
the `this` keyword is invoked before
the parameterized constructor's code
executes.

Avoid doing work within constructors, 
especially I/O or
anything that could cause a delay.
Objects should be instantiated 
without the possibility of any slow,
blocking code.

Generally, the order of *members*
defined in a class are in order:

- Constructors
- Fields and Properties
- Methods


Use static classes sparingly, as they
can cause difficulty in testing.

A singleton can be declared using:

```csharp
public class Thing {
	private Thing() {}
	private static Thing _instance;
	public static Instance {
		get {
			if (_instance == null) {
				_instance = new Thing();
			}
			return _instance;
		}
	}
}
```

The private constructor ensures
that the class cannot be instantiated
using `new`.  The static field holds
the one instance to be used always,
and the instance property getter 
creates the static instance only if
necessary, and returns it.


##Properties

A class property can be lazy-loaded
easily:

```csharp
class Thing {
	private ChildThing _childThing;
	public ChildThing ChildThing
	{
		if (_childThing == null) 
		{
			_childThing = new ChildThing();
		}
		return _childThing;
	}
}
```
		
C# 6 adds a useful operator for 
null testing:

```csharp
var result = thing?.ChildThing?.Name;
```

Above, if thing is null, the entire
expression is evaulated to null.  If
not, the thing instance's ChildThing
is checked.  If it is null, the 
expression is null, but if not the 
expression finally evaluates to the
ChildThing's Name.  Remember the 
`?.` operator as: *if null then null,
if not then dot*.


## Methods

When deciding to use a method vs a
property, remember that a property
should execute immediately, never 
using blocking I/O or anything that
would prevent an immediate return.
Use a method for things that take
time or produce side effects (or
require parameters).

Overriding the `ToString()` method
of `object` can help in debugging -
the Visual Studio debugger uses
a class's `ToString()` when displaying
the value of an object:

```csharp
public class Thing {
	public override string ToString() {
		return string.Format("Thing: {0} ({1})", this.Name, this.Desc);
	}
}
```

