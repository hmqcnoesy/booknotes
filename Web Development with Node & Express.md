#Web Development with Node and Express

##Chapter 3
Use `npm init` to create package.json

Use `npm i --save express` to install express module into
node_modules folder and to update the package.json file
with the dependency.

Create a .gitignore file listing files and dirs to exclude:
```gitignore
#ignore packages installed by npm
node_modules
#any other files or folders to ignore like *.bak
```

The index.js or app.js, or whatever entry point you
specified during npm init might have contents like
```javascript
var express = require('express');
var app = express();
app.use(function(req, res) {
    res.type('text/plain');
    res.status(200);
    res.send('this is the returned content');
});
app.listen(process.env.PORT || 3000, function() {
    console.log('express started');
});
```

`app.use()` is middleware - catching 
everything that wasn't matched by a route.   
The `app.get()` specifies a route:
```javascript
app.get('/', function(req, res) {
    res.type('text/plain');
    res.send('Home');
});
app.get('/about', function(req, res) {
    res.type('text/plain');
    res.send('About');
});
```

The route specified in app.get doesn't care about upper
or lower case or presence or absence of trailing slash.
The response status defaults to 200.  The route string
also supports `*` as a wildcard, e.g. `'/about*'`.

Install your preferred view engine, e.g.
```
npm i --save vash
```

Then in your app.js:
```javascript
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');
```

Create a layout.vash view:

```html
<!doctype html>
<html lang="en">
<head>
    ...
    @html.block('styles')
</head>
<body>
    <div>
		@html.block('content')
    </div>
</div>
<script src="/js/site.js"></script>
@html.block('scripts')
</body>
</html>
```

In vash you can specify as many blocks as needed.
The styles, content, and scripts are a good starting 
point.  

An individual view named home.vash
would hook into the layout like this:
```html
@html.extend('layout', function(model){
	@html.block('content', function(model){
        <div class="header">
            <h1><i class="fa fa-home"></i> U&amp;T Home</h1>
        </div>
		
		<div class="content">

	})
	
	@html.block('scripts', function() {
		<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script>
            $(function () {
				alert('hey');
			});
		</script>
	})
})
```

Note that the view that hooks into the layout view is
not required to implement all of the blocks.  They are
all optional.

To send the view from app.js:

```javascript
app.get('/', function(req, res) {
    var model = { message: 'anything' };
    res.render('home', model);
});
```

To specify location of static files to be served, use
middleware before declaring any routes:

```javascript
app.use(express.static(__dirname  '/public'));
```

##Chapter 4 Tidying Up
To create your own module, make a .js file and add
properties or functions to the `module.exports` object.
For instance:
```javascript
var localVariable = [1,2,3,5,7,9];
module.exports.getRandomNumber = function() {
    var idx = Math.floor(Math.random() * localVariable.length);
    return localVariable[idx];
};
```

Then to use that functionality, in app.js you could
```javascript
var mymodule = require('./mymodule.js');
...
var rnd = mymodule.getRandomNumber();
```

Note that `require()` takes a relative path for custom
modules, as opposed to npm-installed modules that are
required by name only (and are all located in node_modules).
*Do not put custom modules in node_modules.*

##Chapter 5 Quality Assurance
Testing techniques for Express apps

##Chapter 6 Request and Response Objects
The request objects starts out as a node http.IncomingMessage
object, then Express adds functionality.  Here are 
a few objects added to request:

`req.params` is an array containing named route params.

`req.query` is an object containing querystring params:
```javascript
app.get('/qs', function(req, res) {
    res.render('qs', { id: req.query.id });
});
```

`req.body` is an object containing POST parameters, but 
using it requires the body-parser middleware. 
Do (`npm i --save body-parser`) and then in app.js:
```javascript
app.use(require('body-parser')());
```

`req.route` has info about currently matched route.
This is good for debugging routing issues.

`req.cookies` has objects containing cookie values if
you use the cookie-parser middleware:
```javascript
// Cookie: name=asdf
req.cookies.name // "asdf"
```
`req.url` actually contains just the path and querystring
but not the protocol, host, or port.

The response object starts out as http.ServerResponse
but Express adds functionality, such as:

`res.status(code)` sets the status code.  If not set, 
Express defaults to 200.

`res.set(name, value)` sets a response header:
```javascript
app.get('/', function(req, res) {
    res.set('x-ua-compatible', 'IE=Edge');
    res.send('index');
});
```

`res.cookie(name, value, [options])` sets a cookie to be
stored on the client.  `res.clearCookie(name, [options])`
will clear a cookie from the client.

`res.redirect([status], url)` redirects the client.  The 
default status is 302 (Found).  Set to 301 for a 
permanent redirect.

`res.send(body)` or `res.send(status, body)` will send a
response to the client, defaulting to text/html. 

`res.json(json)` or `res.json(status, json)` will return 
JSON to the client with an optional status code.

`res.sendFile(path, [options], [callback])` sends a file
to the client.  But use the static middleware instead when
possible.

`res.render(view, [locals], callback)` renders the 
specified view.  The locals object is the model to be 
handed to the view.

##Chapter 7 Templating
Handlebars :(

##Chapter 8 
Form handling requires the use of the body-parser
middleware: `npm i --save body-parser`, then:
```javascript
app.use(require('body-parser')());
...
app.post('/processform', function(req, res) {
    console.log(req.body.name);
    console.log(req.body.email);
    // etc.
});
```
File uploads can be handled by other middleware.  For
instance, `npm i --save formidable`

##Chapter 9 Cookies and Sessions
Use cookies in Express with the middleware:
`npm i --save cookie-parser` and then in app.js:
```javascript
app.use(require('cookie-parser')('this is your cookie secret'));
// make sure your cookie secret is externalized, not in source control
...

app.get('/setcookies', function(req, res) {
    res.cookie('somekey', 'somevalue');
    res.cookie('signedSomekey', 'somevalue', { signed: true });
});

app.get('/readcookies', function(req, res) {
    var cookieValue = req.cookies.somekey;
    var signedValue = req.signedCookies.signedSomekey;
});

app.get('/clearcookies', function(req, res) {
    res.clearCookie('somekey');
    res.clearCookie('signedSomekey');
});
```

`res.cookie()` can take an options object as 3rd parameter
with the following properties: **domain**: allows assigning
a cookie to a specific subdomain, **path**: restricts to 
a path such as '/foo' (implicit trailing wildcard), 
**maxAge**: milliseconds for client to keep the cookie,
**secure**: if true, send only over https, **httpOnly**:
if set to true, instructs browser not to allow the value 
to be modified by JavaScript, **signed**: set to true to 
prevent tampering and make it available in 
`res.signedCookies` instead of `res.cookies`.

Sessions can be set up using the express-session
middleware: `npm i --save express-session`. And app.js:
```javascript
app.use(require('cookie-parser')('cookie secret goes here'));
app.use(require('express-session')());
...
// then the session object becomes a prop of each req
app.get('startsession', function(req, res) {
    req.session.userName = 'Anonymous';
    var color = req.session.color || 'black';
});
```

##Chapter 10 Middleware
A middleware is a function that takes a req, res, and next
and optionally an error object.  Middleware can also take
a string route as a first parameter, and if that is 
excluded, behaves as if "*" were passed in.  Middleware 
functions are executed in an ordered pipeline.  Adding 
middleware functions to the pipeline is done using `app.use()`.
Middleware is invoked in the order it was added, and it
is common practice for the last middleware in the 
pipeline to be a "catch all" for any request that isn't
handled to completion by another middleware.  A request
is handled to completion by a middleware if that
middleware does **not** call `next()`.  It is each
middleware function's job to properly call `next()`
correctly (or ***not*** call `next()` as the case may be),
or the entire rest of the pipeline breaks down.

The Express route handlers (`app.VERB`) are middleware
that handle only the specified verb, and only for a 
matching route.  The route handlers take a callback
function with 2, 3, or 4 parameters:
```javascript
app.get('*', function(req, res) { ... });
app.get('*', function(req, res, next) { 
    ... 
    /* call next() if necessary */ 
    /* if next() is not called, pipeline is terminated */
});
app.get('*', function(err, req, res, next) {
    /* handle error in err object */
});

```

