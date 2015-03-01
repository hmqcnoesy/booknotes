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
 
truthy and falsy values
true                  |   false
______________________|_____________
any non-empty string  |  empty string
any non-zero number   |  0, NaN
any object            |  null
 -                    |  undefined
 
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
