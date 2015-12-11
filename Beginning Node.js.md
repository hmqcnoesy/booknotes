# Beginning Node.js

## JavaScript for understanding Node.js


###Scope

The only recommended way of creating 
a new variable scope is to use a function.
So an IIFE is an appropriate method for
handling scope.


###Closures

When a function is defined inside another
function, the inner function has access
to variables declared within the outer
function, even when after the outer 
function returns.


###Revealing module pattern

The revealing module pattern uses a 
function to return an object (functionality
and data):

```javascript
function createThing() {
	var message = 'this is a thing';
	function doThingStuff1() {
		//...
	};
	function doOtherThingStuff() {
		//...	
	};
	
	return {
		doThingStuff: doThingStuff,
		doOtherThingStuff: doOtherThingStuff,
		message: message	
	};
}
```


### Keyword `this`

When not explicitly set, or when not
within a method, `this` refers to the
Node `global` object, just as it refers
to the `window` object when running code 
in a browser.  As always, the keyword
`new` in JavaScript when used with a function
call, creates a new object and applies that
object to the `this` within that called 
function:

```javascript
function foo() {
	console.log(this);
}

var thing1 = foo(); // foo logs "global"
var thing2 = new foo(); // foo logs empty object
```

### Prototypes

Every object in JavaScript has an internal
link to another object: its *prototype*. An
object's prototype object is accessible via 
the `__proto__` property.  When a property 
is accessed on an object, if that object has
no such property, the prototype is checked,
then its prototype is checked, up to the root
JavaScript object. As soon as a property is
found, it is returned.  If no property is 
found, it is `undefined`.

```javascript
var foo = {};
foo.__proto__.bar = 123;
console.log(foo.bar); // 123
console.log(global.bar); // 123
```

It is poor practice to use any `__` prefixed
properties, as those are essentially hidden
implementation details.  But when the `new`
operator is used with a function the 
`__proto__` is set to the function's 
`.prototype`.  A function's `.prototype`
value is the object that is used for the
prototype of any new object created when 
using the `new` keyword:

```javascript
function foo() {};
foo.prototype = {
	name = 'fooname'
};

var baz = new foo();
console.log(baz.name); // fooname

var qux = new foo();
console.log(qux.name); // fooname

qux.name = 'q';
console.log(qux.name); // q
console.log(baz.name); // fooname
```

The above example illustrates that 
prototypes are good for saving memory
when attributes or behaviors are shared,
but are problematic for attributes that
need to be written to.  So an object's
methods (functions) are ideal candidates
to be defined on a prototype because all
objects created using the revealing 
module pattern will have the same shared
functions/methods, but attributes are part
of each individual object, where they 
belong.  So an improved pattern to allow
reproduction of objects would be:

```javascript
function Thing() {
	this.name = 'thing name'
}

Thing.prototype.doThingStuff = function() {
	console.log('do ' + this.name);
}

var thing = new Thing();
console.log(thing.name); // "thing name"
thing.doThingStuff(); // "do thing name

var thing2 = new Thing();
thing2.name = "two";
console.log(thing2.name); // "two"
console.log(thing.name); // "thing name"
thing2.doThingStuff(); // "do two
```

Most "classes" inside core Node.js are
written using the above pattern.


### Error handling

An asyncronous callback that throws an error
after its calling code finishes executing
will not be caught in a wrapping try/catch
because that code has already finished 
executing when the error is thrown:

```javascript
try {
	setTimeout(function() {
		throw new Error("something bad");
	}, 1000);
} catch (err) {
	console.log('will never happen');
}
```

In the above example, the node process exits
because the error is thrown *outside* of a 
try / catch.  This situation must be 
handled by putting the try / catch *inside*
of the callback itself:

```javascript
setTimeout(function() {
	try {
		throw new Error("bad");
	} catch (ex) {
		console.log('caught bad');
	}
}, 1000);
```

However, this can cause a problem if a 
callback needs to be notified of an
error.  Consider:

```javascript
function doThing(callback) {
	try {
		throw new Error('x');
		// notify callback() somehow
	} catch (ex) {
		// notify callback() of error somehow
	}
}
```

The pattern used in Node.js for these
situations is to send an error object
to the callback as the first parameter
if there is an error.  A falsy value is
passed as the first parameter if no
error:

```javascript
function doThing(callback) {
	var otherData = { };
	try {
		throw new Error('x');
		callback(null, otherData);
	} catch (ex) {
		callback(ex, null);
	}
}
```


##Core Node.js

