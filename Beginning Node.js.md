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


## Core Node.js

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

The `EventEmitter` class is the basis for many derived
types in open source software projects.  These are 
modules that inherit from `EventEmitter` and export 
the resulting object.

```javascript
var EE = require('events').EventEmitter;
var utils = require('utils');

var Thing = function() {
   EE.call(this); 
};

utils.inherits(Thing, EE);

Thing.prototype.connect = function() {
  /*...*/
  this.emit('connected');  
};

module.exports = Thing;
```

Such an object can then be used:

```javascript
var Thing = require('./thing.js');
var thing = new Thing();
thing.on('connected', function() {
   console.log('received a connected message'); 
});

thing.connect();
```

The `process` global in Node.js is an example
of one such type that inherites from `EventEmitter`.
For instance, it emits an `uncaughtException`
event, which can be subscribed (but processing
should never continue after handling it because
it is raised only when execution is in an unreliable
state:

```javascript
process.on('uncaughtException', function(err) {
   console.log(err.exception);
   console.log(err.stack); 
   process.exit(1); // return error status, no more processing
});

throw new Error('this will break something');
```

The `process` global also emits the `exit` event
but the process is being torn down at that point
so it is not possible to cancel the exit or run
any async code:

```javascript
process.on('exit', function() {
    console.log('this should get logged at the end.');
});
```


### Streams

Streams are essential for performance, for example,
serving a large file without the help of streams
would require loading the entire file in memory
before starting to send the first bits of the file
to the client.  With the help of a stream, however,
the file can be sent without completely loading all
the bits into memory, by sending the file chunk by
chunk.

Different types of streams in Node.js include
*Readable*, *Writable*, *Duplex*, and *Transform*.

- Readable: a stream that can be read but not
written to, for example, `process.stdin`.
- Writable: a stream that can be written to
but not read from, for example, `process.stdout`.
- Duplex: a stream that can be read and written
to, for example, the network socket.
- Transform: a special case of a duplex stream,
where the output is computed from the input, for
example compression or encryption streams.

The building blocks for streams are available
via `require('stream')`.  Streams are built on
the `Stream` type which in turn is based on the
`EventEmitter`.  

```javascript
var stream = require('stream');
var readable = new stream.Readable({});
var writable = new stream.Writable({});
var duplex = new stream.Duplex({});
var transform = new stream.Transform({});
```

All streams support the `pipe` method which pipes
the output of the stream to the parameter given:

```javascript
var fs = require('fs');
var readableStream = fs.createReadStream('./streamed.txt');
readableStream.pip(process.stdout);
```

Returned streams can be piped in a chain pattern:

```javascript
var fs = require('fs');
var gzip = require('zlib').createGzip();

var inp = fs.createReadStream('test.txt');
var out = fs.createWriteStream('test.txt.gz');

inp.pipe(gzip).pipe(out);
```


### Consuming readable streams

Because streams are based on `EventEmitter`, it is
easy to listen for events on a stream object, such
as `'readable'` which is raised when there is new data
available to be read from the stream, which is done 
using the `read` method on the stream.  When there is 
nothing left to read from the stream the `read` method
returns `null`:

```javascript
process.stdin.on('readable', function() {
    var buf = process.stdin.read();
    if (buf == null) {
        console.log('read complete');
        return;
    }
    
    console.log('got: ');
    process.stdout.write(buf.toString());
});
```


### Writing to writable streams

A writable stream has a `write` method and an `end` method.

```javascript
var fs = require('fs');
var ws = fs.createWriteStream('message.txt');
ws.write('foo');
ws.write('bar');
ws.end();
```


## Getting started with HTTP

One of the core modules in Node.js is `'http'` which has
a `createServer` method, whose callback argument is a function
that is called on each received HTTP request.  The callback
takes a request and response as parameters which are a
readable and writable stream, respectively.  The function
returns a server object which has a `listen` method that 
starts the server listening to HTTP requests:

```javascript
var http = require('http');

var server = http.createServer(function(req, res) {
    console.log(req.headers);
    res.write('hey'); 
    res.end();
});

server.listen(8080);
console.log('listening on 8080');
```

The HTTP header `Transfer-Encoding: chunked` notifies 
the server that the client can accept a response in
a stream, chunk by chunk.  When the response is 
sent in these chunks the first line of each chunk is 
a hexadecimal value indicated the size of the chunk
in bytes.  The response is ended with a 0-sized chunk.

If the `statusCode` property of the response object
is not set, it defaults to 200.  To set it explicitly,
use `res.statusCode = 404;`.

To set any header value for a response, use 
`setHeader('Header-Name', 'header value');`, for
example `res.setHeader('Content-Type', 'text/hmtl');`.
There is a handy npm package named "mime" that can
lookup mime types based on file types:

```javascript
var mime = require('mime');
console.log(mime.lookup('./somefile.txt'));
console.log(mime.lookup('./index.html'));
```

Important request properties include `req.method`
and `req.url`.

Since the response object is a writable stream,
data can be piped into it.  So a file from the 
filesystem could be written into the response
stream:

```javascript
fs.createReadStream('./file.html').pipe(res);
```


## Introducing Connect 

Connect is a middleware framework.  `npm i connect`
will install only the core framework.  Each piece
of middleware is separated into its own module.

The `connect` function is at the heart of a
Connect application.  It returns a dispatcher
function that can be passed to `http.createServer`:

```javascript
var connect = require('connect');
var http = require('http');

var app = connect();

http.createServer(app).listen(3000);
```

As-is, the example above will return a 404 response
for every request, which is the default behavior.
To properly handle requests, the dispatcher must
be configured with the `use` method, which registers
a piece of middleware with Connect.  The `use` method
takes three parameters:

- a request object which inherits from the core
http request object
- a response objecct which inherits from the core
http response object
- an optional "next" callback which allows passing 
control to the next registered middleware, or informing
Connect about an error condition.

The simplest possible middleware would be one that
ignores the request and response and simply forwards
control to the next registered middleware:

```javascript
var connect = require('connect');

var app = connect();
app.use(function(req, res, next) { next(); });
app.listen(3000);
```
 
A slightly more useful example would be one that
logs each request's URL and method:
 
```javascript
var connect = require('connect');
 
var app = connect();
app.use(function(req, res, next) {
   console.log(req.method, req.url); 
   next();
});
app.listen(3000);
```

The `use` function takes an optional string first parameter
that specifies the endpoint to trigger the middleware. If
omitted, all endpoints trigger the middleware, if included,
only a matching endpoint triggers.  This is sometimes 
referred to as "mounting".  For example, to use the logging
code above only when requests come in for '/log':

```javascript
var connect = require('connect');
var app connect();

function logit(req, res, next) {
	console.log(req.method, req.url);
	next();
}

app.use('/log', logit); 
app.listen(3000);
```

In the above example, all requests **starting with** the 
specified path (/log) are handled by the `logit` middleware.
All other requests do not trigger middleware.  Note that
middleware code itself shouldn't check `req.url`.  It should
assume that `app.use` mounted the middleware correctly so 
that it is triggered if and only if appropriate.


### Creating configurable middleware

Middleware is configurable by passing in arguments to a 
function that returns the middleware function.  A closure
around the variables allows configuration of the function's
behavior:

```javascript
var connect = require('connect');
function logit(includeTimestamps) {
	return function(req, res, next) {
		if (includeTimestamps) console.log(new Date(), req.method, req.url);
		else console.log(req.method, req.url);	
		next();
	};
}

var logit1 = logit(true);
var logit2 = logit(false);

var app = connect();
app.use(logit1);
app.use(logit2);
app.use(function(req, res, next) {
	res.end();
});

app.listen(3000);
```


### Chaining middleware

Chaining allows different pieces of middleware to cooperate, because
request and response objects passed to each middleware are mutable.
For instance, one middleware could try to parse a request body from
JSON into an object and put that object in `req.body` for other 
middlewares further down the line to use.  Then any middlewares later
in the pipeline would be able to simply access `req.body` instead of
worrying about how to parse the JSON on its own.

Middleware has the responsibility of continuing the pipeline by  
calling `next()`, but by the same token has the option of ending the
processing pipline by *not* calling next.  For example, a middleware
could change for the header `Authorization: Basic QWxhZGRbp...=` and
decode the base64 string, checking for the correct credentials.  If
the correct credentials were not supplied, the middleware could leave
out the call to `next()` and instead set the response status to 401
and call `res.end()`.

Another way the processing pipeline can be short-circuited is by
passing an error object to `next`.  This informs connect that an
error occurred, and no other middlewares are called, and the error
message is sent to the client with a response status of 500.  So
in this example the second middleware never executes:

```javascript
var connect = require('connect');
function mw1(req, res, next) {
	next(new Error('something terrible happened'));
}

function mw2(req, res, next) {
	console.log('this is the second mw');
}

var app = connect();
app.use(mw1);
app.use(mw2);
app.listen(3000);
```

However, a middleware can specifically be used to handle middleware
errors.  Such a middleware takes four arguments: `error,req,res,next`
and is called *only* in the case of an error.  For example, this fourth
middleware is executed, but the third is not:

```javascript
var connect = require('connect');
var app = connect();
app.use(function(req, res, next) { console.log('this is executed'); next();});
app.use(function(req, res, next) { next(new Error('something bad')); });
app.use(function(req, res, next) { console.log('this won\'t get called'); next(); });
app.use(function(error, req, res, next) { console.log(error); next(); });
app.listen(3000);
```


## Introducing Express

Node web apps are built on the `http` module and
`createServer`.  Connect builds on this foundation
adding a middleware pipeline.  Express takes the
Connect additions a step further, supplying common
functionality necessary for a web application.

An application dispatcher is created in the same
way Connect does it:

```javascript
var express = require('express');
var app = express();
app.use(/*...*/);
express.listen(2000);
``` 

Error handling and other middleware all function the
same as with Connect.  All Connect middleware are
Express middlewares, but not all Express middlewares
are Connect middlewares because Express modifies the 
request and response objects, and Express middleware
likely depends on those modifications, which Connect
does not provide.

One piece of middleware included in Express is `static`
which allows static content to be served from a 
specific location:

```javascript
var express = require('express');
var app = express();
var path = require('path');

var filesPath = path.join(__dirname, 'public');
app.use(express.static(filesPath));

app.listen(3000);
```

Another middleware included in Express is the body
parser which parses posted HTML form data or JSON
data from a request body and puts the parsed object
into `req.body`:

```javascript
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser());
app.use(function(req, res) {
    if (req.body) console.log(JSON.stringify(req.body));
    res.end();
});
```

Cookie support also comes with Express.  To set a cookie,
use the `cookie` property of the response:

```javascript
var express = require('express');
var app = express();
app.use(function(req, res){
    res.cookie('name', 'foo');
    res.end();
});

app.listen(2000);
```

To get cookies back out, they have to be parsed because
cookies are all piled together in one string.  The
middleware to parse the cookie name and value pairs is
`cookie-parser`:

```javascript
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(function(req, res) {
    if (req.cookie.name == 'foo') {
        /*...*/
    }
    res.end();
});

app.listen(3000);
```

Compression is another useful features that comes with
Express.  To automatically compress HTTP responses > 1kB
just add in the compression middleware:

```javascript
var express = require('express');
var app = express();
var compression = require('compression');
var path = require('path');
app.use(express.static(__dirname));
app.listen(3000);
```

I have been able to get the above to work only with 
serving static content via `express.static`, not with
any dynamically generated responses.

The `connect-timeout` Express middleware is handy for
preventing a hung middleware from staying hung forever:

```javascript
var express = require('express');
var app = express();
var timeout = require('connect-timeout');

app.use('/broken', timeout(5000), function(req, res, next) {
    // don't call next, simulates a hang
});

app.listen(3000);
``` 

Beware when using the above middleware, as a "hung" middleware
may suddenly come back to life and continue processing, 
including a possible call to `next` even after the 503 
response has been sent by the timeout middleware.


### Express response object

The express response object inherits from the standard Node.js
server response object described previously.  It adds functions
though, for convenience and flexibility.  For instance, the
chainable function `.status()` can be used to set the HTTP status 
code of the response:

```javascript 
var express = require('express');
var app = express();

app.use(function(req, res) {
    res.status(201).end();
});

app.listen(3000);
```

Also, an improvement over `.setHeader()` is the `.set()` method
which takes an object argument to set multiple response 
headers at once:

```javascript
var express = require('express');
var app = express();

app.use(function(req, res) {
    res.status(201)
       .set({ "content-type": 'text/plain', "x-custom": 'custom value' })
       .end();
});

app.listen(3000);
```

Of course, if all you need to set is the header, an Express 
response object has a method for that:  `res.type('text/plain')`.
The argument can be a variety of value types: `text/html`, `html`
and `.html` all work the same.

Redirect responses are easy with an optional status code as a 
first parameter (default is 302), and a url for the second:

```javascript
res.redirect('http://www.google.com');
res.redirect(301, '/other');
```

In previous examples, calls to `res.write` actually streamed
the response back to the client.  The response header 
`Transfer-Encoding: Chunked` was included (because of the 
call to `res.write` and the response body contained a line
with the count of bytes in the chunk, then the chunk, then
a line with a zero indicating a final, empty chunk.  For
instance, this server-side code:

```javascript
var express = require('express');
var app = express();
app.use(function(req, res) {
    for (var i = 0; i < 3; i++) {
        res.write(i.toString() + '\r\n');
    }
    res.end();
});
app.listen(3000);
```

would result in an HTTP response like the following 
(assuming the server believes the client can handle 
the chunked response based on the request headers):

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Sun, 24 Jan 2016 03:22:42 GMT
Connection: keep-alive
Transfer-Encoding: chunked

3
0

3
1

3
2

0
```

Notice that each chunk is 3 bytes, as indicated by the
"3" lines.  These chunks were streamed to the client 
as the bytes were written to the response using `res.write`.
A call to `res.send` on the other hand, will not stream,
rather, it sends all bytes at once.  It also can accept a 
status code as a first parameter, and if you pass it an
object, it will set the content type to `application/json`:

```javascript
res.send(404, 'not the droids you\'re looking for');
res.send({name: "thing1"});
```


### Express request object

The request object in Express also inherits from the
standard Node.js server request, and adds common 
handy functionality.  For instance, the case-insensitve
`get` method gets a header value:

```javascript
var ctype = req.get('content-type');
var val = req.get('x-custom-header');
```

Express parses URLs of requests into handy properties
such as the `path` and `query`:

```javascript
var id = req.query.id;
var area = req.query.area;
var path = req.path;
```

An important thing to note:  the `req.url` property is
always relative to where the executing middleware was
mounted:

```javascript
var express = require('express');
var app = express();
app.use('/one', function(req, res) {
    res.send(req.path);
});
app.use('/', function(req, res) {
    res.send(req.path);
});
app.listen(3000);
```

So in the example code above, a request to /foo will show
"/foo" in the response, but a request to /one/two will 
show "/two" in the response.  If you need the complete
URL instead of the one relative to where the middleware 
is mounted, use `req.originalUrl`.


### Understanding REST

