#Async in C# 5.0

##Introduction

Asynchronous code frees up the thread
it was started on.

The difficulty with async code is that
usually you need to take some action 
when some async operation completes.  In
synchronous code that is easy to do - 
just write more code after the blocking
operation's line(s) of code.  In async
programming, the next line of code will
usually run before the async operation 
completes.  

The `async` and `await` keywords are 
actually C# compiler features - the 
compiler performs translations of the 
source code to make execution perform
asynchronously.  This eliminates the 
need for complex patterns of the past 
that clumsily enabled async operations.
These features allow easy-to-read code
to express what to do after async 
operations are completed.

Here is an example of blocking code that
downloads the content of a web page:

```csharp
private void DumpWebPage(string uri) 
{
	var wc = new WebClient();
	var page = wc.DownloadString(uri);
	Console.WriteLine(page);	
}
```

The `wc.DownloadString()` call is potentially
very slow, and is a blocking call.  Here is a 
version of the method using `async`:

```csharp
private async void DumpWebPageAsync(string uri) 
{
	var wc = new WebClient();
	var page = await wc.DownloadStringTaskAsync(uri);
	Console.WriteLine(page);
}
```

The method above is marked with the `async`
keyword, which is required for any methods 
that contain the `await` keyword.  When the 
compiler sees `await`, it effectively chops
up the method, and everything after the
awaited call is moved to a separate method
which is called once the awaited call is 
finished.  This allows the code execution
to continue - the method is returned when
the awaited call is started, allowing the 
thread to continue other processing, such 
as a UI thread responding to user interation.


##Why programs need to be Asynchronous

Desktop apps' code runs on the UI thread,
so slow blocking calls freeze up the UI.
Async calls will free up the UI thread so
it can continue responding to user input.

Web apps don't have the same problems with
UI threads, but their long-running operations can
still benefit from async features.  If code
is servicing an HTTP request and waiting for
database results to be returned from a query,
that thread is blocked.  When hundreds of 
threads are running on an app server because
threads are blocked, the performance and 
throughput of the server is negatively 
impacted, even though the CPU might be idle.
Async code can free those blocked threads to
continue servicing HTTP requests during long
running operations.


##Writing asynchronous code manually

The event-based asynchronous programming
model utilizes an event method that is 
called after a long running process completes:

```csharp
private void DumpWebPage(string uri) 
{
	var wc = new WebClient();
	wc.DownloadStringComplete += OnDownloadComplete;
	wc.DownloadStringAsync(uri);	
}


private void OnDownloadComplete(object sender, DownloadStringCompletedEventArgs eventArgs) 
{
	txt.Text = eventArgs.Result;	
}
```

The first method returns immediately, so the
UI thread is avaiable to process other input.
This code works fine, but is messier than
pure synchronous code, and becomes more 
complicated if the web client object must be 
used for multiple requests.

Another pattern uses the `IAsyncResult`
interface, and also requires splitting code
into an additional method:

```csharp
private void LookupHostName() 
{
	var unrelatedObject = "hello";
	Dns.BeginGetHostAddresses("oreilly.com", OnHostNameResolved, unrelatedObject);	
}

private void OnHostNameResolved(IAsyncResult ar) 
{
	var unrelatedObject = ar.AsyncState;
	var addresses = Dns.EndGetHostAddresses(ar);
	//do something with addresses	
}
```

This is also not an intuitive solution to 
asynchronous requirements.

An improvement over the previous two patterns
is to use a lambda expression as a callback 
parameter:

```csharp
private void LookupHostName() 
{
	var usefulVariable = 3;
	GetHostAddress("oreilly.com", address =>
		{
			// do something with address and usefulVariable
		});	
}
```

A major benfit of the pattern above is the
closure that allows use of `usefulVariable`
within the callback.  But the lambda is a 
bit difficult to read, and can cause arrow
code if multiple asynchronous calls must 
be made.  Another issue is that exceptions
thrown within the callback are not handled
in the calling code.


###Introduction to Task

The Task Parallel Library was introduced in
.NET 4.0.  The most important class is `Task`
which represents an ongoing operation.  The
generic version, `Task<T>`, acts as a promise
that a type `T` will be available once the 
operation is complete.  The `async` feature 
in C# 5.0 uses `Task` under the hood, but 
`Task` and `Task<T>` can be used without the
`async`.  This is done by starting the 
operation which returns `Task<T>` and then
using `ContinueWith()`:


```csharp
private void LookupHostName()
{
	Task<IPAddress[]> ipAddressPromise = Dns.GetHostAddressesAsync("oreilly.com");
	ipAddressPromise.ContinueWith(_ =>
		{
			var ipAddresses = ipAddressPromise.Result;
		});	
}
```


###The problem with manual asynchrony

All of the patterns above share one
conceptual flaw - they are all split
into two methods (the actual method and
a callback).  Lambdas for callbacks can
mitigate some of the problems posed by 
the method splitting, but the code is 
still left cluttered and hard to follow.
Worse, multiple asynchronous calls, or 
looped calls, become much more of a 
challenge.


##Writing async methods

In C# 5, a method marked `async` can
contain the `await` keyword, which 
transforms the method in which it is 
used.

The `await` keyword can be used on 
any method call that returns `Task<T>`
to transform it into an awaited expression,
which evaluates to an object of type `T`.
The returned object is assigned to a variable
and can be used intuitively in the rest of 
the method.  

```csharp
private async void AddAFavicon(string domain) 
{
	var wc = new WebClient();
	var bytes = await wc.DownloadDataTaskAsync("http://" + domain + "/favicon.ico");
	// do something with bytes	
}
```

And `await` can be used on
a method call that returns `Task` to 
transfrom it into an awaited statement,
which cannot return a value (like a `void`
return type).  This makes sense, as `Task`
represents an ongoing operation only, whereas
`Task<T>` represents an ongoing operation's 
promise that `T` will become available:

```csharp
private async void SendMailAsync(body)
{
	var msg = new MailMessage();
	msg.From = "me@example.com";
	msg.To = "you@example.com";
	msg.Subject = "Subject":
	var smtp = new SmtpClient("smtp-server", 25);
	await smtp.SendMailAsync(msg);
}
```

The methods that return `Task` and `Task<T>`
need not use the `await` keyword, in which
case the `Task` or `Task<T>` return values 
themselves must be handled appropriately.
In this case, the `await` keyword will at 
some point be used in order to await the 
completion of the operation and/or to transform
the promise of type `T` into an actual `T`:

```csharp
var task = wc.DownloadStringTaskAsync(uri);
// do other stuff
string page = await task;
```

In the above example, the web client's download
method is executed synchronously, returning a
`Task<string>`, but starting up an asynchronous
downloading.  The "other stuff" continues 
to execute synchronously.  It is only when the
`await` expression is evaluated that the compiler
magic allows the downloading operation to 
finish asynchronously, and code execution to 
continue in an intuitive manner.

Multiple asynchronous operations can easily
be executed concurrently by keeping track of
the task objects returned by each of the 
calls:

```csharp
var task1 = wc.DownloadStringTaskAsync("http://oreilly.com");
var task2 = wc.DownloadStringTaskAsync("http://troyhunt.com");
var task3 = wc.DownloadStringTaskAsync("http://microsoft.com");
var result1 = await task1;
var result2 = await task2;
var result3 = await task3;
```

However the above is dangerous if the
asynchronous operations could throw exceptions
because multiple thrown exceptions could be lost or
mishandled.


###Async method return types

A method marked with `async` may return
`void`, `Task`, or `Task<T>`.  Async methods
typically involve long-running operations,
but return quickly, and these return types
jibe with those ideas.  A return type of
`void` is a "fire and forget" method, where
no caller ever needs to know when the 
operation is finished.  These occaisions are
rare.  A return type of `Task` allows a
caller to await the operation and propagate
any exception that occurred during the
async operation.  When a result from the 
operation is not needed, returning `Task` 
is preferred to `void` for this reason.
A return type of `Task<T>` are used when
the result of the operation is needed.


###Async, method signatures, and interfaces

The `async` keyword appears in a method
declaration like the `static` keyword does,
but is nonetheless not part of the method
signature.  So in overriding a method or
implementing an interface, the `async` 
keyword is completely ignored.


###The return statement in async methods

In methods marked `async void` and `async Task`
return statements are optional and do not
specify a return type.

In methods marked `async Task<T>` return
statements must have an expression that 
evaluates to a type `T` and are not optional.
The difference between the return type in
the method signature and the actual type
returned is accounted for by the compiler
transformation of the code.


###Async methods are contagious

The usual way to handle a `Task` object is 
to `await` it.  And to await a task, the
method must be marked as `async`.  And if
a method is marked `async`, it will typically
return a `Task` as well.  So callers of `async`
methods become `async` themselves, and async
programming can quickly pervade an entire
codebase.  But because of the ease of writing
and maintaining the async methods, this 
shouldn't ever be a problem.


##What await actually does

When `await` is reached in code, the 
current thread must be released and the
current method must return.  When the
awaited task is complete, the method 
must continue from where it was, as if
it hadn't returned earlier.  To achieve
this, the runtime must store info about
the current situation so that it can 
recreate the situation when it comes
time to resume the execution.  This
info gathering and storage is far reaching
and complex.  Local variables, scoped
variables, parameters, etc. are all stored
as well as an execution context, security
context, and call context.  All of the 
stored info must be reconstructed for 
continution of execution following `await`.

Because of this compiler magic that 
reconstructs a moment in time when the 
awaited task is ready, the `await`
keyword cannot be used in certain places.
`catch` and `finally` blocks can't contain
`await` because an exception is still 
unwinding the stack there.  Similarly,
`await` cannot be used in `lock` blocks,
LINQ expressions, or in code marked
`unsafe`.

When a `Task` is complete, the `IsFaulted`
property indicates if an exception was 
thrown during the task execution.  When
using `await`, the exception will be 
rethrown so as to get the exception into
the method containing the `await`.  An
unhandled exception in an `async` method
is stashed in the `Task` returned to the
caller, where the exception will be thrown
where it is awaited.


###Async methods are synchronous until needed

Async methods are cool.
