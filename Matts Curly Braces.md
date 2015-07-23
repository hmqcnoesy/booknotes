#Matt's Curly Braces

##CSS Purpose

Several HTML elements and element attributes
were created as
the early web grew in order to apply 
styling and give web content a distinctive
look and feel.  These elements and
attributes included:

```html
<!-- DON'T USE THESE -->
<basefont>
<font>
<center>
<big>
<strike>
<p bgcolor="yellow" text="green">
<a margin="12">
```

And tables were used extensively to
design layouts, creating grids with rows
and columns of content and to 
position elements relative to one another.
The problem with using tables is that they
are verbose (contain a lot of excess 
nested elements), they are semantically 
incorrect (`<td>` indicates table data, not
a generic container for content), they
make HTML less readable and maintainable
and thus are more prone to errors, and they
entangle HTML structure with styling.

The attributes and elements mentioned 
previously have similar problems, 
especially the fact that they entangle
HTML structure with sytling, which means
that to make a change such as shrinking
or expanding the margin of an element, the
actual semantics and structure of the HTML
would have to be modified.

CSS (Cascading Style Sheets) was created
to apply styles to markup (like HTML).
With CSS, most of the problems of applying 
styles directly in HTML are alleviated,
and many, many more possibilities are 
available.


##CSS Mechanics

CSS works by specifying (selecting) 
an element and then specifying a 
property of the selected element(s)
and then specifying the value to
apply to that property.  The general
syntax is:

```css
selector { property: value }
```

As a concrete example, to set the background
color of all paragraph elements to 
gainsboro, the following CSS would be used:

```css
p { background-color: gainsboro }
```

Like HTML, whitespace is ignored (except
within certain selectors, which will be 
covered later).  Multiple properties 
can be listed, so the following example
applies gainsboro background color with 
dark blue text to all paragraph elements:

```css
p {
	background-color: gainsboro;
	color: darkblue;
}
```


##Where does CSS go
To hook CSS up to the HTML to which it
applies, it can be included in one of
three places.  It can be written as
an attribute (applies only to the 
element, so no selector or curly braces
are used):

```html
<p style="background-color: gainsboro;">
	This paragraph looks grayish
</p>
```

Or it can be placed within a `<style>`
element within the `<head>` element:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Testing style element</title>
		<style>
			p { background-color: gainsboro; }	
		</style>
	</head>
	<body>
		<p>This paragraph looks grayish</p>
	</body>
</html>
```

And CSS can be placed in a separate file,
with a .css extension, and a link to it
is specified with a `<link>` element in 
the HTML document's `<head>`.  For 
example, assume we had this in a file
named "style.css" and it was in the same
folder as our HTML document:

```css
p { background-color: gainsboro; }
```

Then the HTML file would just need a 
`<link>` element that specifies a value
of the `href` attribute