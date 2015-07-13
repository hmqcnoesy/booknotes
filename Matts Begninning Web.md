#Matts Beginning Web

##HTTP
HTTP is the method of communication
between a client computer (using
software such as a browser)
and a server computer (for example, amazon.com).
The client initiates communication
by send a request message to the
server.  The request is processed
and a response is sent back to the
client.  There is always one and only
one response per request.

An HTTP request must specify the
Uniform Resource Locator (**URL**)
resource the client is accessing.
A URL consists of a scheme (e.g. http://),
a domain (e.g. amazon.com), a port
(not required if using default number, 
e.g. :8080), a path to the resource
(optional, e.g. /products/12345),
a query (optional, e.g. ?search=batman). 
Other details of URLs are less common 
and not relevant to our discussion.

Any computer can be a web server,
but in order to process and respond
to HTTP requests, the server must
run software that provides the functionality.
**Apache** and Microsoft's Internet
Information Services (**IIS**) are commonly
used softare that enable a computer to
function as a web server.

When a web server receives an HTTP
request, it might do one of any number
of things.  The request might be for a 
static file that the web server has 
stored on disk.  In that case, the server
can just send a copy of the file back.
The web server may also run some
executable code to dynamically generate
a response to send back.  Or it might
send a response indicating some kind
of error situation.


##Web Pages
A web page is a document written in HTML
and retrieved over HTTP (via an HTTP 
request initiated by the client, and an
HTTP response devlivered by the server).
A web page is loaded the same whether you
type the URL in manually, open a shortcut
or bookmark, or click on a link pointing
to the page.

Documents for delivering content on the 
web are HTML, regardless of the web server
technology used to deliver them, or any
apparent file name extension you may see in
a URL.  In other words, when you visit pages 
whose URL ends in something like `.php`,
`.aspx`, `.jsp`, `.do`, etc., rest assured 
that the content your browser is receiving
from the web server is HTML.

A browser can retrieve and handle lots of
other types, like `.jpg`, `.pdf`, and
`.xls`, but when it displays a web page,
the underlying document for that web page 
is HTML.


##HTML
An HTML file is text, *marked up* with a 
set of simple rules.  The *markup* describes
to the browser how to format the content.  
For instance, the following markup specifies
a paragraph:

```html
<p>Once upon a time...</p>
```

Here, the `<p>` is an **opening tag** 
followed by some content ("Once upon a 
time...") and the `</p>` **closing tag**.
Notice the opening and closing tags differ
only by the abscense or presence of the `/` 
character.  These things together form an 
HTML **element**.  A browser would read the
example line above and display the "Once 
upon a time..." text as a paragraph.

An element's opening tag can specify 
additional information.  For instance,
a link in an HTML document is specified 
by an anchor element, which uses the
letter 'a' for tags.  The content between 
the tags is shown as the link's text, and
the target URL of the link is specified
by an **attribute**:

```html
<a href="http://www.mozilla.com/firefox">Download Firefox</a>
```

In the above example, the 'a' element
uses the href attribute, with a value 