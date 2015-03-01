#Professional JavaScript for Web Developers

##typeof operator
`typeof` is an operator but can also be used like a function i.e. `typeof(x)`
```javascript
var x = "abc"; 
typeof x; // "string" 
 
x = 1.0; 
typeof x; // "number" 
 
x = true; 
typeof x; // "boolean" 
 
x = undefined; 
typeof x; // "undefined" 
 
x = {}; 
typeof x; // "object" 
 
x = function (a) {
    alert(a);
}
 
typeof x; // "function"
```

##types
undefined type
```javascript
var msg;
alert(msg == undefined); // true
```

null type
```javascript
var car = null;
alert(typeof car); // null
```
 
boolean (true/false, case-sensitive) type coerced when necessary or use Boolean() casting function
```javascript
Boolean("x"); // true
Boolean(null); // false
```
 
Truthy and Falsy values

true                  | false
----------------------|---------------
any non-empty string  | empty string
any non-zero number   | 0, NaN
any object            | null
 -                    | undefined
 
number type: ints and floats are handled differently but are both just number types
```javascript
var a = 0.1, b = 0.2;
if (a + b == 0.3) // false!!!
if (a / 0) // true (Infinity)
if (NaN == NaN)  // false - NaN never equals anything
if (isNaN(a / 0)) // true
```

some number function
```javascript
parseInt("123");
parseFloat("1.23");
Number(true); // 1
Number(false); // 0
Number(null); // 0.
Number(undefined); // NaN
Number('x'); //NaN
Number(''); // 0
Number('012'); // 12
```

unary + operator can be substituted for `Number()`:
```javascript
+('hello'); // NaN
```
 
strings are immutable
```javascript
String(x); //same as .toString() except returns "null" and "undefined" when appropriate.
 ```

objects
```javascript
var o = new Object();
o.hasOwnProperty('name'); // checks if name exists on obj (not prototype)
o.isPrototypeOf(obj);
o.propertyIsEnumerable('prop');
o.toLocaleString();
o.toString();
o.valueOf();
```

##Control Flow
Logical OR evaluated against objects if preferredObject is null, backupObject:
```javascript
var obj = preferredObject || backupObject;
 
var x = {};
var y = 1;
if (x == y) { // x.valueOf() is checked
}
 
var a = null, b;
if (a == b) {  //true (null == undefined)
}
 
var j = {}, k = {};
if (j == k) {  //false (only true if j and k point to same object)
}
```
 
 
`for` loops - variables are placed in function scope
```javascript
for (var i = 0; i < 10; i++) {
}
 
console.log(i);  // i is valid here
```
 
`for-in` enumerates properties of an object
```javascript
for (var propName in window) {
    document.write(propName);
}
``` 
 
`with` statement is poor practice, syntax error in strict mode
```javascript
with (location) {
    var url = href;
    var host = hostname;
}
```

##Functions
if function doesn't use return or uses return without value, `undefined` is returned.
 
arguments - named args are a convenience
```javascript
function howManyArgs() {
    alert(arguments.length);
}
 
howManyArgs('x', 21); // 2
howManyArgs('');  // 1
howManyArgs()  // 0
```
 
named args are simply aliases into `arguments[]`
```javascript
function doAdd(num1, num2) {
    if (arguments.length < 2) {
        return num1 * 2;
    } else {
        return arguments[0] + num2;
    }
}
```
 
oddly, `arguments[x]` and corresponding named arg occupy different spots in memory, but are kept in sync

##Variables
Five primitive types: `undefined, null, boolean, number, string` are accessed by value. Reference types dont' allow direct access to memory locations, only access by ref
 
ref types have dynamic properties:
```javascript
var obj = new Object();
obj.name = 'x';
obj.id = 1;
alert(obj.name);
 
var str = 'abc';
str.name = 'str'; // no error
alert(str.name);  // undefined (not an error)
```
 
Copying values - when a value type is assigned value a copy is made:
```javascript
var x = 0, y = 5;
x = y;  // x and y are separate copies of value 5
 
var x = {},
    y = {};
 
x = y; // x and y now point to same object on heap
```
 
ref type arg passing:
```javascript
function setName(obj) {
    obj.name = 'x';
    obj = new Object();
    obj.name = 'y';
}
 
var obj = new Object();
setName(obj);
alert(obj.name);  // 'x'
```
Above is proof that all args are passed by value
 
You can determine the type of a ref type using `instanceof` operator and the name of the constructor 
```javascript
alert(obj instanceof Array); // false
```

##Scope
Global variables and functions are created as properties and methods on the window object, which is one execution context.

Each function call has its own execution context.  When function code is entered, that function's execution context is pushed onto a context stack.  When function is finished the stack is popped and returns to previous execution context.

A scope chain is thus created - the first in the chain is always the variable object (inaccessible obj used behind scense for ex context) of the context whose code is executing the last of the chain is always the global context. identifiers are resolved by searching the scope chain. Search begins @ front, continues until identifier found

`catch` and `with` statements add their own variable objects to the front of scope chain

When `var` is omitted when creating a variable, it is added to the global variable object in strict mode, you must use var.

Local variables with same name as global variables effectively hide the global ones because the search stops at the local variable object when its found.

##Garbage Collection
Mark and sweep is used by most browsers - could be a list of in-context variables, or a bit flag on each variable.

IE, FF, Opera, Chrome, Safari all use mark/sweep. Netscape used ref counting, but circular refs problematic.

IE8 and earlier used COM objects for DOM and BOM instead of native javascript objects. COM uses ref counting, so this was a problem.
To remedy, make sure you set js object refs = null when they are done.
That will allow them to get GC'd using ref counting.

##Objects
```javascript
var a = new Object();
a.name = 'a';
a.id = 1;
//equivalent to
var a = {
	name: 'a',
	id: 1
};
```

Best practice arguments to function: use named args as required parameters to a function, then an object encapsulating all optional paramters.
```javascript
function foo(req1, req2, options) {
	...
}
foo(1,22, { bg: 'f', x: 'bar' });
```

Bracket notation is equivalent to dot:
```javascript
var x = {
	name: 'x',
	id: 1
}
var y = {};
y['name'] = 'y';
y['id'] = 2;
```
Use the above only when variable values are needed to get properties.

##Arrays
Arrays can hold any type in each slot.
```javascript
var a = new Array();
var b = new Array(20); //initial size
var c = new Array('red', 'green', 'blue'); // populated
```

It is also possible to omit "new" to use the function style syntax:
```javascript
var d = Array(3); // 3 items
```

Array literal notation:
```javascript
var e = ['x','y','z'];
var f = [];
```

Length property is not read-only:
```javascript
e.length = 2;
```
Which is useful for appending to an array:
```javascript
e[e.length] = 'j';
e[e.length] = 'k';
e[e.length] = 'm';
```

Adding to any position beyond `length` extends to that position:
```javascript
e[100] = 'h';
alert(e.length); // 101
```

Some built-in functions:
```javascript
var colors = ['r','b','g'];
colors.toString(); // "r,g,b"
colors.valueOf(); // "r,g,b"
colors.join('x'); // "rxgxb"
```

Stack methods - push takes any # of args and adds to end and returns new length
```javascript
var arr = [];
arr.push('x','y');
arr.push('2');
arr.length; // 3
```

`pop` removes last item and returns it:
```javascript
alert(arr.pop()); // "2"
alert(arr); // "x,y"
```

Queue methods - `shift` is the LIFO version of `pop`:
```javascript
arr.push('z1', 'z2', 'z3');
var first = arr.shift();
alert(first); // "x"
alert(arr.length); // 4
```

And `unshift` adds items to front of array (as opposed to `push`)

Reordering:
```javascript
var ints = [1,2,3,4,5];
ints.reverse();
alert(ints); // "5,4,3,2,1"
```

Sort - by default stringifies:
```javascript
var values = [0,1,10,15,5];
values.sort();
alert(values); // "0,1,10,15,5"
```

Override default by passing in a comparison function:
```javascript
function compareNumbers(v1,v2) {
	if (v1 < v2) return -1;
	elseif (v1 > v2) return 1;
	else return 0;
}

values.sort(compareNumbers);
alert(values); // "0,1,5,10,15"
```

Concatenation - clones and appends:
```javascript
var cnct = values.concat([20, 21]);
alert(cnct); // "0,1,5,10,15,20,21"
```

Slice clones and replaces:
```javascript
var slc = values.slice(1);
alert(slc); // "1,5,10,15"
slc = values.slice(1,4);
alert(slc); // "1,5,10"
```

Splice can be used to delete or insert or replace elements in the array.

`indexOf` returns -1 if no match:
```javascript
var idx = [1,2,3,4,5,4,3,2,1];
idx.indexOf(4); // 3
idx.lastIndexOf(4); // 5
```

Iterative methods - a function parameter is passed:
```javascript
var everyResult = idx.every(function(item) {
	return item > 2;
});

alert(everyResult); // false

var someResult = idx.some(function(item) {
	return item > 2;
});

alert(someResult); // true

var filtered = idx.filter(function(item) {
	return (item > 2);
});

alert(filtered); // "3,4,5,4,3"

var mapped = idx.map(function(item) {
	return item * 2;
});

alert(mapped); // "2,4,6,8,10,8,6,4,2"

idx.forEach(function(item) {
	alert(item);
});
```

##Dates
Dates are stored as number of milliseconds since 1/1/70
```javascript
var now = new Date(); // current datetime
var bday = new Date(Date.parse("May 25, 1977"));
var millenium = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)); // notice Jan is 0, hours are in 24 format
var d = new Date(2002,2, 15,13,15,0,0); // Creates in local time zone of system

var start = Date.now();
doSlowStuff();
var stop = Date.now();
alert(stop - start);
```
