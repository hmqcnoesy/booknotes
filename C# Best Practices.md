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


## Literal separators

The `_` character can be used anywhere
in a numeric literal without changing
the value of the number:

```csharp
public class Thing 
{
	public MaxCount { get; } = 1_000_000_000;
}
```


## Using static

Static methods can be used without
qualifying them by their class name,
and instead having a `using` statement
to import the static methods of the
class:

```csharp
using System.Console;

public class ConsoleApplication1 
{
	public static void Main() 
	{
		WriteLine("hello world");
	}
}
```

The class in the using statement
must be a static class. It cannot 
be a non-static class even if the
class has static methods.

In the case of a conflicting instance method,
the instance method wins.  In the case
of two static methods from different classes
both brought in with `using` statements,
the compiler will generate an error.


## Conditional Access

Testing for null values is simplified:
Instead of:

```csharp
int? paramCount = null;

if (command != null && command.Parameters != null) {
	paramCount = command.Parameters.Count;	
}
```

C# 6 allows:

```csharp
var paramCount = command?.Parameters?.Count;
```

The C# 6 expression is evaluated by
first checking command for null.  If
null, the entire expression evaluates 
to null, if not, the Parameters collection
is checked for null.  If null, the 
expression evaluates to null.  If not,
the expression evaluates to the Count
property of Parameters.  The functionality
of this operator can be remembered thus:
*if null then null, if not then dot*.


## Await and catch / finally

C# 6 now allows `await` calls within
`catch` and `finally` blocks.


## Exception filters

Exceptions can be caught based on
boolean values in the catch statement
itself.  If the expression is true,
the catch block is entered.  If false,
subsequent catch blocks are evaluated:

```csharp
try {
	command.ExecuteNonQuery();
} catch (Exception ex) if (ex.Message.Contains("ORA-00260") {
	// try it again?	
} catch (Exception ex) {
	tx.Rollback();
	throw;	
}
```

