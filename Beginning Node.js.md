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

When `require()` is used, Node.js runs 
the specified destination JavaScript file
in a new, isolated scope, and returns the
value specified by `module.exports` from
the file.  To store the value of the
`module.exports`, assign the return of
`require` to a variable:

```javascript
var thing = require('./thing.js');
```

Note that a call to `require()` is a 
blocking call.  Execution will wait until
the call is complete.

The return value of a call to `require()`
is cached so subsequent calls passing in
the same destination file (irrespective of
path) will get the cached `module.exports`
value returned originally.  So if a mutable
object is returned, each call to `require`
for a particular file will return the same
shared object instance.


###Object factories

If the default behavior of returning the
same object for `require()` calls that
resolve to the same file is not desired,
a simple object factory setup can be used:

```javascript
module.exports = function() {
	return {
		//object to be created with each call to require
	};	
}
```

And "requiring" the module like this:

```javascript
var foo = (require('./foo'))();
```

The `module.exports` object is implicitly an
empty object that a module can add properties
to.  The `exports` alias can be used as a 
shorthand for `module.exports`.  Node just 
creates a variable like this:

```javascript
var exports = module.exports;
```

So it is important to note that the `exports`
variable could accidentally be reassigned:

```javascript
exports.a = 123;
console.log(module.exports.a); // 123

exports = 'whoops!';
console.log(module.exports); // { a: 123 }
```

So `exports` should be used for ***attaching***
but never ***assigning***.


Modules best practices

- Dont' use `.js` in calls to `require()`
- Use relative paths (e.g. `./foo`) in 
  calls to `require()` for your own 
  project modules.  Leave out paths in calls
  to `require()` for node_modules and core
  modules.
- Use `require()` to get a single file
  per folder, i.e. `index.js`, specifying
  the folder name.


### Useful globals

The `console` is available in any code in a
node application.  Typical methods are 
available on the `console` object, such as
`log`.

The `setTimeout` and `setInterval` functions
are also globally available.

The `__filename` and `__dirname` are available
in every file in a node app.  They store the 
value of the current file and current file's
directory path.

The `process` variable is accessible anywhere
as well, and holds data and functionality
dealing with the Node.js process.  The `argv`
property of `process` contains an array of
the arguments passed to the Node.js process.
For example this command:

```shell
node app.js foo -bar baz
```

Would result in an `argv` value like:

```javascript
['c:\\program files\\node.js\\node.exe', 
'c:\\users\\username\\app.js', 
'foo', 
'-bar', 
'baz']
``` 

The `Buffer` class is also available globally.
Strings and buffers convert into each other
very easily:

```javascript
var str = 'this is a string';

var buf = new Buffer(str, 'utf8');

var roundTrip = buf.toString('utf8');
```

Apparently, 'utf-8' and 'utf8' both work.

All the global methods and properties are 
members of `global`, much like the
`window` object in a browser:

```javascript
console.log(process === global.process); // true
```

But unlike `window`, a module's variables
are placed in an isolated scope.  Members
can but shouldn't be added to `global`.


### Core Modules

Core modules are included using `require()`
without a path to the module, but just
the module name itself.


#### path

The `path` module has useful methods to
resolve inconsistencies between filesystems.
For instance, `path.normalize(str)` will
change a path `str` to a valid path for the
current system.  And `path.join()` takes
an arbitrary number of args and joins them
together into a valid path for the current
system.  It also automatically handles 
path delimiters:

```javascript
var path = require('path');
console.log(path.join('foo', '/bar', 'baz'));
//  logs "foo/bar/baz" or "foo\bar\baz"
```

The `dirname()` method returns the directory
to a file's path, `basename()` returns a 
file name without an extension, and `extname()`
returns a file's extension:

```javascript
var path = require('path');
var f = 'c:\\dev\\test.html';
var d = path.dirname(f); // c:\dev
var b = path.basename(f); // test.html
var e = path.extname(f); // .html
```

#### fs

The `fs` module has filesystem functionality
such as `writeFileSync()` and `readFileSync()`:

```javascript
var path = require('path');
var fs = require('fs');
fs.writeFileSync(path.join(__dirname, 'test.txt'), 'file contents', 'utf8');
var contents = fs.readFileSync(path.join(__dirname, 'test.txt'), 'utf8');
console.log(contents); // file contents
```

The `-Sync` versions of these methods should
be used only in certain scenarios.  Usually the
versions with callbacks are appropriate:

```javascript
var fs = require('fs');
fs.readFile('test.txt', 'utf8', function(err, data) {
	if (err) {
		console.log(err);
		return;	
	}
	
	console.log(data);
});
```


#### os

The `os` module has methods exposing system info,
such as `totalmem()` and `freemem()` and `cpus()`:

```javascript
var os = require('os');
console.log(os.totalmem());
console.log(os.freemem());
console.log(os.cpus().length);
```


#### util

The `util` module has general functionality,
such as the `log()` method which prints a 
timestamp with your message.  The `format()`
method is similar to `printf` in C.  Available
placeholders include `%s` for strings and `%d`
for numbers:

```javascript
var util = require('util');
util.log('The %s is %d dollars', 'thing', 50);
```

`util` also has methods `isArray`, `isDate`
and `isError`.


## Node.js Packages

Scanning for a node module required via a call
to `require()` follows these rules:

1. if the value passed to `require` starts with
`./`, `../`, or `/` it is assumed to be a file
based module and the path specified is used to 
find the module
2. if the value passed to `require` does not
start with one of those strings, it is assumed
to be a core module or stored in node_modules.
 - Searching for core modules is done first.
 - If there is not a matching core module,
 the node_module folder in the current directory
 is searched.
 - If there is not a matching module in the
 current directory's node_module folder, the
 parent directory's node_module folder is 
 searched, and so on until the module is found
 or until the search hits the root and gives up.

So the only difference between a file based 
module and a node_module module is the way each
one is referenced in the `require` call and the
way the filesystem is searched for the .js file.

Sometimes multiple files need to work together
as a module, in which case they can be put in 
a folder together, with an index.js "entry point"
file.  Then the module is required using a call
to `require` with the folder name as the parameter.

The scanning process for node_module modules 
makes it simpler to use `require` anywhere in an
application and have it automatically resolve to 
the right code.  It also makes it easy to share
modules between different apps - the module can
be stored in a common ancestor directory's 
node_module folder.


### JSON

JSON files can be required just as a module is,
but instead of executing the code in the module,
when `require` is called, a JavaScript object is 
returned:

```javascript
{
	"foo": "bar",
	"baz": "boo"
}
```

```javascript
// if above file is foo.json
var obj = require('./foo');
console.log(obj.baz);  // boo
```

The above is much easier than opening files 
and parsing them with `JSON` (which is also
available on `global`).


## Events and streams


### JavaScript and inheritance

A typical inheritance pattern in JavaScript
involves a "parent" such as:

```javascript
function Animal(name) {
	this.name = name;
} 
Animal.prototype.walk = function(destination) {
	console.log(this.name + ' is walking to ' + destination);
}

var animal = new Animal('elephant');
animal.walk('Melbourne'); // elephant is walking to melbourne
```

An inheriting type could then be used:

```javascript
function Bird(name) {
	Animal.call(this, name);
}
Bird.prototype.__proto__ = Animal.prototype;
Bird.prototype.fly = function(destination) {
	console.log(this.name + ' is flying to ' + destination);
}

var b = new Bird('finch');
b.walk('slc');
b.fly('chandler')
```

Using the `__proto__` property is not recommended.
A better way to set up this prototype chain in Node.js:

```javascript
var utils = require('utils');
function Bird(name) {
	Animal.call(this, name);
}
utils.inherits(Bird, Animal);
Bird.prototype.fly = function() { /*...*/ };
```

The `utils` module uses `Object.create()` behind the
scenes to "properly" create a prototype chain.


### Node.js events

Events can be emitted using the `events` module (built-in)
and the associated `EventEmitter` object:

```javascript
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('cheese', function(arg1, arg2) {
    console.log('cheese raised', arg1, arg2);
});

emitter.emit('cheese', { a: 123 }, { b: 456 });
```

Any arbitratry number of subscribers can handle a
single emitted event, and they are called in the 
order that they registered for the event.  Also,
any arguments passed in to the event handlers are
shared among all handlers.

To remove a handler, a reference to the exact 
handling function must be passed to `removeListener`:

```javascript
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

var fooHandler = function(a,b) {
    console.log('foo handled');
    emitter.removeListener('foo', fooHandler);
};

emitter.on('foo', fooHandler);

emitter.emit('foo'); // foo handled
emitter.emit('foo'); // no console message
```

The handling of an event one time only need not
use `removeListener`.  Instead, `once` can be used
in place of `on`:

```javascript
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.once('foo', function() {
    console.log('handled');
});

emitter.emit('foo'); // handled
emitter.emit('foo'); // not handled
```

`EventEmitter` has a method `listeners` than returns
and array of functions that have been registered for
the name of the passed in event:

```javascript
var funcs = emitter.listeners('foo');
console.log(funcs);  // [[Function: a], [Function: b]]
```

The `EventEmitter` raises a `newListener` event when
a new listener is added and a `removeListener` event
when one is removed. 

Memory leaks occur when subscribing to events in a 
callback or loop but forgetting to unsubscribe.  `EventEmitter`
will print a warning to the console if more than 10 
subscribers register for a single event.  

The `error` event is raised when an unhandled exception
occurs during executions of a Node.js program.  If there
is ***no*** listener for the `error` event registered, 
the default behavior occurs:  a stack trace is printed to
the console and the program is exited.


### Creating your own EventEmitter

