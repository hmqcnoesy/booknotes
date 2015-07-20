#Matts Beginning Web

##HTTP
HTTP is the method of communication
between a client computer (using
software such as a browser)
and a server computer (for example, 
amazon.com).
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

A web server is a computer with an 
uninterrupted network connection whose sole 
purpose is to deliver content to clients.
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
uses the href attribute, with a value of
"http://www.mozilla.com/firefox".  Most
HTML elements do not require attributes
but some do.  For instance, when including
an image in HTML, the `img` element is used
and a `src` attribute is required to specify
the source of the image:

```html
<img src="http://www.mozilla.com/firefox/logo.gif" />
```

The `img` element shown above has another
interesting feature: there is no closing
tag. This makes sense considering an image
doesn't have any text content.
Elements with no content are 
**self-enclosing elements**, 
which have a `/` character
before the final `>` character.


###Block and inline elements
Most HTML elements can be classified as
**block** or **inline**.  Block elements
are meant to be displayed on their own 
vertically in the HTML document, whereas
inline elements are meant to occupy the 
same vertical space as their enclosing 
element.  For example, the `<p>` elements
below are block elements, but the `<a>` 
elements are inline.  So the paragraphs 
are rendered to take up 100% of the
horizontal width of thier container,
whereas the links flow with the content
around them:

```html
<p>Go <a href="http://www.mozilla.com/firefox/download">here</a> to download</p>
<p>Find more info in the <a href="http://www.mozilla.com/firefox">about</a> section.</p>
```

Hard returns in HTML documents are handled
differently than one might expect.  Any
whitespace character or string of multiple
whitespace characters are rendered as a single
space.  So the following example renders
exactly the same as the previous example:

```html
<p>
	Go 
	<a href="http://www.mozilla.com/firefox/download">
		here
	</a> 
	to download.
</p>
<p>
	Find more info in the 
	<a href="http://www.mozilla.com/firefox">
		about
	</a> 
	section.
</p>
```

The HTML fragment above is a good example
of nesting in HTML.  Each `<p>` element
is a **parent element** of a `<a>` element, 
which are in turn **child elements** of
`<p>`.  An HTML document can have complex,
arbitrarily deep nesting, but a child element
must be closed before the parent element.
So the following is *incorrect* HTML:

```html
<p>This 
	<a href="http://www.google.com">
		link to google
	</p>
	is all messed up.
</a>
```

The corrected HTML would close the child
`<a>` before closing the parent `<p>`:

```html
<p>This 
	<a href="http://www.google.com">
		link to google
	</a>
	is all messed up.
</p>
```

With deeper nesting, in addition to 
parent and child elements, there can be
**ancestor** and **descedant** elements.  
And elements
with the same parent can be referred to 
as **sibling** elements.

There is one other simple rule when
it comes to nesting elements: *inline
elements cannot have child block elements*.
