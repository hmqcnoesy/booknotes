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
before the final `>` character. The latest
version of HTML (HTML5) does not require
that self-enclosing elements use the 
`/` character in the tag, so it is common
now to see either of these forms:  

```html
<img src="http://www.mozilla.com/firefox/logo.gif" />
<img src="http://www.mozilla.com/firefox/logo.gif">
```


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

Whitespace characters in HTML documents 
(including spaces, empty lines, hard returns,
and indentations) are handled
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
	Find more        info in the 
	
	
	<a href="http://www.mozilla.com/firefox">
		about
	</a> 
	
	
	section.
</p>
```

Because the browser collapses successive
whitespace characters into one, it is easier
to write HTML in a way that is most readable
to *you*.  Tabs can be used (as above) to 
help visualize how HTML elements are nested.
Opening and closing tags of block elements
can be placed on their own line (as above).

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


###HTML Semantics
Decisions to use one particular HTML
element over another should be driven
by semantics rather than styling.  In other
words, don't use HTML elements to make
a page *look* a certain way, rather, use
them to give meaning to the content they
contain (is this a paragraph, a header,
an ordered list, etc.).

Here are some lists of common HTML elements.
Each element indicates the purpose of the 
content it contains:


####Structure elements
These elements organize the main structure
of a page:
 - `<header>`
 - `<nav>` includes navigation elements
 - `<h1>` through `<h6>` are titles and subtitles
 - `<footer>` 
 
 
####Text elements
These elements define the purpose of
text content:
 - `<p>` 
 - `<ul>` (unordered lists)
 - `<ol>` (ordered lists)
 - `<li>` (list item)
  
  
####Inline elements
These elements distinguish smaller chunks
of text from the text content around them:
 - `<strong>` specifies **strong** text
 - `<em>` specifies *emphasized* text
 - `<a>`
 - `<abbr>` spcifies abbreviations
  
  
####Generic elements
When no semantic element is suited to some
content, the generic block and inline 
elements can be used:
 - `<div>` is a generic block element
 - `<span>` is a generic inline element
 
There are many more HTML elements.  For
an exhaustive list, consult the HTML element
reference on the
[Mozilla Developer Network](http://developer.mozilla.org/en-US/docs/Web/HTML/Element)


##HTML documents
The above examples have all been HTML
fragments, rather than complete and valid
HTML documents.  All HTML sent to the 
browser should be correct so that there is
some degree of confidence that it will be
displayed properly, and so that the HTML
can be more easily maintained.  A valid
HTML document consists of the following:


###Doctype
The **doctype** is the first bit of info 
in a valid HTML document, and indicates to
the browser the version of HTML the
document is using.  The version of HTML
that should be used today is HTML5 and is
specified by a very simple doctype:

```html
<!doctype html>
``` 

Note that the doctype "element" isn't
really an element - it doesn't contain 
other elements, it has no closing tag, 
and is not self-enclosing.  It is just
a single line of text at the top of the 
HTML document to instruct the browser 
on how to treat the document.


###The `<html>` element
After the doctype, a valid HTML document
has a single `<html>` element that encloses
all other content within the document.
So this one `<html>` element is an 
ancestor of every other element in the 
document:

```html
<!doctype html>
<html>
	...(everything goes in here)...
</html>
```

The `<html>` element has two children only
in a valid document: `<head>` and `<body>`.


###The `<head>` element
The `<head>` element contains information
that pertains to the document itself, and 
does not contain document content.  For 
instance, a `<title>` element can specify
the text to be displayed in the browser tab
when that document is loaded.  Some other 
common elements that are found in the 
`<head>` element include:

 - `<style>`
 - `<link>`
 - `<meta>`
 
The `<style>` element specifies styles
to be applied in the document. A `<link>` 
element specifies the location
of a stylesheet to be used in a similar
manner.  This will be explained in detail 
when discussing CSS.

A `<meta>` element is a generic 
container for data
about the document that cannot be 
represented by another element (such as
`<title>` or `<link>`).  One common
use of the `<meta>` element is to specify
the text encoding of the document to 
be utf-8:

```html
<meta charset="utf-8">
```

Another common use of the `<meta>` tag
is to describe the contents of the 
document.  The description is never 
displayed to the user, but search engines
will read the description and use it
when fulfilling user queries:

```html
<meta name="description" content="A simple, yet valid, HTML example">
```

###The `<body>` element
Following the `<head>` element, and 
still enclosed within the `<html>` 
element, a valid HTML document contains
a `<body>` element, which contains all
the document's content to be displayed
in the browser.

Here is an example of a valid HTML
document using some of the elements 
described above:
 
```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>A valid document</title>
		<meta name="description" content="A simple, yet valid, HTML example">
	</head>
 	<body>
	 	<header>
			<img src="http://cdn.sstatic.net/stackoverflow/img/sprites.svg" />
			<h1>A valid HTML document</h1>
	 	</header>
		<p>
			Hello from a valid HTML document
		</p>
	</body>
</html>
```


##Links
Links (using the `<a>` element) have 
already been described above.  But the
previous examples all used **absolute**
`href` values, meaning the complete URL
to the linked resource was included.  
For example:

```html
<p>
	I have found that searching
	<a href="http://www.google.com">google</a>
	works better for me than searching
	<a href="http://www.bing.com">bing</a>.
</p>
```

In addition to **absolute** URLs, `<a>`
elements can link to **relative** URLs.
These URLs are relative to the location of
the current document.  For example:

```html
<a href="about.html">About</a>
```

The `href` attribute above does not have a
complete URL, so it is interpreted as 
being relative to its containing document.
In other words, the document at
http://www.orbitalatk.com/flight-systems/propulsion-systems
may have a link like this:

```html
<a href="SLS-solid-rocket-boosters">SLS</a>
``` 

When clicked, the browser navigates to
http://www.orbitalatk.com/flight-systems/propulsion-systems/SLS-solid-rocket-boosters

Relative URLs can use `.` to specify the
current directory and `..` to specify the 
parent directory.  So the propulsion systems
document above could have relative links
like this:

```html
<a href="../aerospace-structures">Aerospace Structures</a>
<a href="../../space-systems">Space Systems</a>
```

A `target` attribute on an `<a>` element
can specify that the link should be opened
in a new window (or browser tab) when 
clicked:

```html
Open
<a href="http://www.google.com" target="_blank">
	google
</a>
in a new tab.
```

##Images
Images are the most common non-textual
content type on the web.  As detailed
previously, an image is displayed using
the `<img>` element with the value of the
`src` attribute specifying the location
of the image file.  The `src` value can be
absolute or relative, just like the `href`
value of an `<a>` element.  

The `alt` attribute of an `<img>` element
is considered a required attribute.  Its
value is the text to be displayed in the
event that the image cannot be retrieved
or displayed, and is the text used by 
screen reader software for the visually
impaired.

Images are displayed in their native size
by default in the browser, but `height` 
and `width` attributes can specify other 
values:

```html
<img src="http://upload.wikimedia.org/wikipedia/meta/0/08/Wikipedia-logo-v2_1x.png"
	 alt="the wikipedia logo"
	 height="100"
	 width="300">
```

The `<img>` element by default is inline,
so it will flow with text content around it
as if it were just another word in the text.


##Tables
