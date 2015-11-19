#What's New in C# 6

To modify the C# version used
in a Visual Studio project,
open the project properties,
click on the "Build" tab, then
click the "Advanced" button and
modify the "Language Version".
The default value in Visual
Studio 2015 is C# 6.

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

