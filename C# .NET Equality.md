# C# .NET Equality

.NET has no concept of operators such
as `==`, `<`, `>`, etc.  Those are 
provided by C#:  .NET deals only in 
methods.  So equality in .NET is usually
handled with the virtual `Equals()` 
method, which does a check on the value
stored for a variable.  So reference types
are considered equal only if they point
to the same memory location:

```csharp
var thing1 = new Thing { Name = "thing" };
var thing2 = new Thing { Name = "thing" };
Console.WriteLine(thing1.Equals(thing2)); // false

thing2 = thing1;
Console.WriteLine(thing1.Equals(thing2)); // true
```

But value types are considered equal
if their values stored in memory are 
the same:

```csharp
public struct Thing {
	public string Name { get; set; }
}

public static void Main() {
	var thing1 = new Thing { Name = "asdf" };
	var thing2 = new Thing { Name = "asdf" };
	Console.WriteLine(thing1.Equals(thing2)); // true
	
	thing1.Name += " ";
	Console.WriteLine(thing1.Equals(thing2)); // false
}
```

This works because a `struct` derives
from the `System.ValueType` type, which
in turn derives from `System.Object`.
`System.ValueType` overrides the `Equals()`
method:  using reflection, 
it recursively calls `Equals()` 
for each field in the type and returns
true if and only if all calls to `Equals()`
return true.

Because `Equals()` is virtual it can
easily be overridden.  The .NET `String`
is one type that *has* overridden the 
`Equals()` method so that instead of 
comparing address values, the referenced
strings are compared for value equality:

```csharp
var str1 = "str";
var str2 = "str str";
Console.WriteLine(str1.Equals(str2)); // false

str1 += " str";
Console.WriteLine(str1.Equals(str2)); // true
```

The `Equals()` method presents a problem
if there is any possibility that the 
object it is called on is null.  For
these cases, the static version of `Equals()`
can be used:

```csharp
object.Equals(thing1, thing2);
object.Equals(null, null);  // true
```

The `ReferenceEquals()` method will have 
the same result as `Equals()` for types
that have not overridden `Equals()`.  But
it always checks that two variables refer
to the same reference:

```csharp
var thing1 = new Thing { Name = "asdf" };
var thing2 = new Thing { Name = "asdf" };
Console.WriteLine(object.ReferenceEquals(thing1, thing2)); // false
thing2 = thing1;
Console.WriteLine(object.ReferenceEquals(thing1, thing2)); // true

var str1 = "asdf";
var str2 = string.Copy(str1);
Console.WriteLine(object.ReferenceEquals(str1, str2)); // false
Console.WriteLine(object.Equals(str1, str2));          // true
```

The C# `==` operator is not the same as
calling `Equals()` although it often gives
the same result.  For instance, `==` with 
primitive types compiles to a `ceq` comparison
which uses hardware CPU registers to do
the comparison.  So there is no call to 
`Equals()`.  In the case of a reference type,
the `ceq` operation compares the memory
addresses, and so usually gives the same
result as a call to `Equals()`.  However,
using `==` to compare two strings does not
result in a `ceq` operation, it results in
a call to a method for the `==` overload
defined for the `String` type.  Properly 
written code for special equality handling
will always both overload the `==` operator
and override the `Equals()` method.
 