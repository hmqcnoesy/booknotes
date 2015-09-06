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


###Parallel code

 