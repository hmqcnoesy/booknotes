#What's New in C# 6

To modify the C# version used
in a Visual Studio project,
open the project properties,
click on the "Build" tab, then
click the "Advanced" button and
modify the "Language Version".
The default value in Visual
Studio 2015 is C# 6.


## String interpolation

C# 6 allows skipping the `string.Format()`
by using an interpolated string:

```csharp
var thing = new Thing { Name = "thing1", Desc = "desc1" };
thing.Children = new List<Thing> { new Thing(), new Thing() };
Console.WriteLine($"The thing {thing.Name} ({thing.Desc}) has {thing.Children.Count} children.");
```


##Auto property initializers

Instead of:

```csharp
public class User {
	public Guid Id { get; set; }
	
	public User() {
		Id = System.Guid.NewGuid();
	}
}
```

C# 6 allows an initializer:

```csharp
public class User {
	public Guid Id { get; set; } = System.Guid.NewGuid();
}
```

Previously, an auto property with a
`get` and no `set` was a compiler
error, because there was no way to 
ever set the vaue for the property.
With an auto property initializer now,
a true read only property makes sense:

```csharp
public class Thing {
	public Guid Name { get; } = System.Guid.NewGuid();
}
```


## Dictionary initialization

C# has always had a dictionary initialization
syntax:

```csharp
var dict = new Dictionary<string, int>() {
	{ "one", 1 },
	{ "two", 2 },
	{ "three", 3 },
}
```

C# 6 has a new syntax that looks more
dictionary-like:

```csharp
var dict = new Dictionary<string, int>() {
	["one"] = 1,
	["two"] = 2,
	["three"] = 3
}
```

It's a similar number of characters
to type, but makes the code a little
more obvious that a dictionary is
being initialized.


## Using static

A `using static` statement can be used with a
static type, then the methods on that 
static type can be used without including
the class to qualify:

```csharp
using System;
using static System.Console;

public class Program {
	public static void Main() {
		WriteLine("hello");	
	}	
}
```

A confilicting instance method name will
win.  Two conflicting using static method
names will generate a compiler error.


## Conditional access operator

Checking for null values can look like:

```csharp
var result = null;

if (thing1 != null && thing1.ChildThing != null) {
	result = thing1.ChildThing.DoSomething();	
}
```

C# 6 allows a simple shortcut:

```csharp
var result = thing1 ?.ChildThing ?.DoSomething();
```

The expression is evaluated by checking thing1
for null.  If it is null, the expression evaluates
to null.  If not, evaulation continues - if ChildThing
is null, the expression is null, and if not, the
method is called and the expression evaluates to
the return value of the method call.  The `?.` 
operator can be remembered as: *if null then null,
if not then dot*.


## await and catch

C# 6 allows `await` statements in a catch and a
finally block.


## Exception filters

A catch statement can be conditionally entered
by including the `if` clause:

```csharp
try {
	cmd.ExecuteScalar();
} catch (Exception ex) if (ex.Message.Contains("ORA-00904")) {
	// do something	
}

```


## Expression bodied members

Instead of:

```csharp
private int _x;
public int X { get { return _x; } set { _x = value; } }
private int _y;
public int Y { get { return _y; } set { _y = value; } }
```

Or:

```csharp
public int X { get; set; }
public int Y { get; set; }
```

C# 6 allows:

```csharp
public int X => _x;
public int Y => _y;
```

Another example:

```csharp
public string FullName { get; set; }
public string FirstName => FullName.Split()[0];
public string LastName => FullName.Split()[1];
```