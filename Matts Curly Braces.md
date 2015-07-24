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

Another way to think about the syntax
is "who, what, and how".  The "who"
is the selector, or who is targeted
for applying styles.  The "what" is 
what property to be set on the "who".
And the "how" is how to set that
property.  So the general syntax could
be illustrated with:

```css
who { what: how; }
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

And finally (the preferred method),
CSS can be placed in a separate file,
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
of the `href` attribute that points to
the location of the CSS file (relative or
absolute) and a `rel="stylesheet"` 
attribute that describes the relationship
of the linked document to the HTML:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Testing style element</title>
		<link href="style.css" rel="stylesheet">
	</head>
	<body>
		<p>This paragraph looks grayish</p>
	</body>
</html>
```

In addition to the advantages mentioned above,
CSS in a separate file also provides improved 
maintainability and speed because the 
same CSS file can be linked to from multiple
HTML documents in a site.  Maintainability is
improved because style changes that affect many
or all pages of a site are made in a single
authoritative location.  Speed is improved
because the browser can download the CSS file 
and cache a copy so subsequent requests for the
same HTML document (or other documents referencing
the same CSS document) will not require the
styling content to be downloaded each time.

Many of the following examples will use
a `<style>` element in the `<head>` of an
HTML document for the sake of making simple
self-contained examples.  But keep in mind 
that in "real" HTML documents this goes against
best practices, which keep CSS documents in
separate files, using `<link>` elements to 
apply them.

 
##CSS Selectors

###Tag names

Previous examples have specified the "who" 
with the simplest of selectors - they have
specified just the tag name of an element
(`<p>`).  This simple and useful selector
type can be used with any tag name:

```css
p { /* styles to be applied to paragraphs */ }
a { /* styles to be applied to links */ }
td { /* styles to be applied to table cells */ }
li { /* styles to be applied to list items */ }
div { /* styles to be applied to divs */ }
```

But selectors are capable of so 
much more.  In fact, CSS selectors can be
considered a very terse query language on 
their own.  

###Classes

The `class` attribute can be applied to any
HTML element.  Its value can specify an
affiliation with a group that may get certain
styles applied.  For example:

```html
<p class="secondary">This paragraph is secondary.</p>
<p>This paragraph has no class.</p>
<p class="secondary">This paragraph is secondary too.</p>
```

Without any special CSS, the above three
paragraphs would be styled identically.  But
the CSS class selector, `.` can be used to 
apply styles to elements of a particular class:
 
```css
.secondary {
	background-color: lightgray;
	color: darkgray;
}
```

Using the class selector alone as above will
select any element, regardless of tag name:

```html
<p class="secondary">
	This will be selected and styled
	when using the .secondary selector	
</p>
<div class="secondary">
	This will be selected and styled
	when using the .secondary selector	
</div>
```

But the class selector can be combined with the 
tag name selector to be more specific:

```css
p.secondary {
	background-color: lightgray;
	color: darkgray;	
}
```

Using the above CSS, only a `<p>` element 
with the secondary class would be styled as
defined.  The `<div>` element would not be 
selected and so would not get the styling 
applied:

```html
<p class="secondary">
	This will be selected and styled
	when using the p.secondary selector	
</p>
<div class="secondary">
	This will <strong>NOT</strong> be selected 
	when using  the p.secondary selector	
</div>
```


###IDs

Like the `class` attribute, the `id` attribute
can be applied to any HTML element.  But
unlike the `class` attribute, an `id` value
must be unique within an HTML document, because
it is meant to identify the element:

```html
<h1 id="pagetitle">This h1 has an id.</h1>
```

The `#` character is used to select an element
by its `id` value:

```css
#pagetitle {
	background-color: darkblue;
	color: white;	
}
```

###Descendant selector

A space character can be used to specify
a descendant in a selector.  So the following
CSS specifies styling for links within
paragraphs, but the styling would not apply
to links that do not have paragraph ancestors:

```html
<!doctype html>
<html>
	<head>
		<title>Testing ancestry styling</title>
		<style>p a { text-decoration: underline; }</style>
	</head>
	<body>
		<p>This <a>link</a> is underlined</p>
		<div>This <a>link</a> is NOT</div>
	</body>
</html>
```

###Child selector

Similar to the descendant selector, a
`>` character can be used to select a *direct*
descendant (in other words a child):

```html
<!doctype html>
<html>
	<head>
		<title>Testing child styling</title>
		<style>p>a { text-decoration: underline; }</style>
	</head>
	<body>
		<p>This <a>link</a> is underlined</p>
		<p>
			This <span><a>link</a></span> is NOT
			because a is not a child of p.
			(it's actually a grandchild).
		</p>
	</body>
</html>
```


###Combining selectors
The selectors detailed above can be combined 
into arbitrarily complex selection "queries":

```css
div#main>p.first span.important>a {
	text-decoration: underline;	
}
```

The above would apply the underline style
to `<a>` elements that are children of
`<span>` elements that have a `class` value
of "important" and are descendants of `<p>` 
elements having a `class` value of "first"
and being children of a `<div>` element with
an `id` attribute equal to "main". (This is 
not an endorsement of such a selector, just
an illustration of capability).  Here is an
example of a complete document showing how
the above style would/wouldn't be applied:

```html
<!doctype html>
<html>
	<head>
		<title>Testing child styling</title>
		<style>
			div#main>p.first span.important>a {
				text-decoration: underline;	
			}
		</style>
	</head>
	<body>
		<a>Not underlined</a>
		<div>
			<a>Not underlined</a>
			<p class="first">
				<a>Not underlined</a>
				<span="important">
					<a>Not underlined</a>
				</span>
			</p>
		</div>
		<div id="main">
			<a>Not underlined</a>
			<p class="first">
				<a>Not underlined</a>
				<span><a>Not underlined</a>
				<span class="important">
					<a>Underlined!!</a>
				</span>
				<span class="important">
					<a id="link" class="notimportant">Underlined!!</a>
				</span>
			</p>
		</div>
	</body>
</html>
```

The query language available through CSS
selectors is terse but rich, due to the 
number of selectors available.  Here is
a small sample:

 | Selector      | Description 
 |---------------|----------------------------------
 | `*`           | Selects all elements
 | (tag name)    | Selects by tag name
 | `,`           | Combines multiple selectors
 | `#`           | Selects by ID
 | `.`           | Selects by class
 | (space)       | Selects descendants
 | `>`           | Selects direct descendant (child)
 | `[x]`         | Selects element where an attribute (x) exists
 | `[x=y]`       | Selects element where attribute (x) has exact value (y)
 | `[x*=y]`      | Selects element where attribute (x) contains value (y)
 | `[x^=y]`      | Selects element where attribute (x) starts with value (y)
 | `[x$=y]`      | Selects element where attribute (x) ends with value (y)
 
 
 ###Pseudo-class selectors
 
 Elements can have different states 
 that can be selected by psuedo-class
 selectors.  For instance, a link
 is usually in its normal state, but
 when the user hovers the cursor over
 the link it is in a "hover" state, 
 and a different set of styling rules
 may be desired.  To do this, the
 `:hover` psuedo-class is used:
 
 ```html
<!doctype html>
<html>
	<head>
		<title>Testing psuedo-classes</title>
		<style>
			a { text-decoration: none; }
			a:hover { color: red;
				text-decoration: underline;
			}
		</style>
	</head>
	<body>
		<p>This <a>link</a>
			has special styling
			when hovering.
		</p>
	</body>
</html>
 ```
 
 
##Inheritance

CSS properties are inherited by their
ancestor elements by default.  So 
to use gray text throughout a document,
rather than apply to each element type in
the document:

```css
p, div, li, h1, a, span { color: gray; }
```

The rule can be applied at a level where
it will be inherited by all ancestors:

```css
body { color: gray }
```

This inheritance is applicable mainly
to properties dealing with text.


##Priority

Obviously an element can be selected
more than once, each time applying
different styles:

```html
<p class="important" id="firstparagraph">
	How will this be styled?
</p>
```

The above paragraph would be selected
in all of the following CSS rules:

```css
p { color: blue; }
#firstparagraph { color: red; }
.message { color: green; }
```

All three rules are trying to set the
color to different values, but the 
browser can pick only one.  The way 
the browser makes a decision is based
on CSS **specificity**.  In this 
particular example, the paragraph text
is red because the `#firstparagraph`
selector is the most *specific* of the
three selectors.

The measure of selectors' specificities
can be very complicated, but to simplify
a rough score can be applied, where `#`
is worth 100, `.` is worth 10 and a tag
name selector is worth 1.  In the case 
of a styling conflict, the selector with
the higher score takes precedence.  If 
two rules have the same score, the one
that comes last will take precedence.


##CSS Colors

Thus far, examples that assigned colors
used named colors such as "red", "blue",
and "gainsboro".  There are 145 such 
named colors, which is a lot when it 
comes to naming colors, but is not enough
when it comes to getting just the color
needed.  There are several ways to specify
precise colors.


###rgb

Colors can be defined by their amounts
of red, green, and blue components.  So
pure blue is 100% blue, 0% green, and
0% red.  Purple would be 100% blue and 100%
red with 0% green.  Black is 0% red,
green, and blue.  White is 100% of all
three.  But rather than using whole 
number percentages, CSS allows a color
to be defined based on its red, green,
and blue components on a scale from 0 
to 255.  So blue, purple, black and white
are respectively:

```css
p { color: rgb(0, 0, 255); }
a { color: rgb(255, 0, 255); }
th { color: rgb(0, 0, 0); }
td { color: rgb(255, 255, 255); }
```


###rgba

Transparency values can be added using
an *alpha* value and using `rgba` in
place of `rgb`.  The alpha value can
range between 0 and 1 (completely
opaque through completely transparent).
The following would be half-transparent
blue:

```css
p { background-color: rgba(0, 0, 255, 0.5); }
```


###rgb hex values
CSS allows for a more concise format of 
specifying rgb values.  The format is the
`#` character followed by six characters,
two hexadecimal characters for each of the
colors red, green, and blue (in that order).
Hexadecimal values go beyond digit 9
(`0123456789ABCDEF`) which is how there are
255 possibilities in a 2-digit value.

These hexadecimal values are more commonly
used than the `rgb()` format, so it is worth
getting used to.  Here are the same colors
as the rgb example:

```css
p { color: #0000ff; }
a { color: #ff00ff; }
th { color: #000000; }
td { color: #ffffff; }
```

Most of the time, hexadecimal values come
from a color picker tool, or are copied from
existing styles or color palettes, etc.  So
there is rarely need to create cryptic-looking
values out of thin air.


##CSS sizing

There are many CSS properties that require
a size value:

 - `font-size`
 - `border-width`
 - `padding`
 - `margin`
 
And the common size units used in CSS are:

 - `px` (pixels) 
 - `%`
 - `em` ("ems", the size relative to an `m` character)


###px

Using pixels is the most straightforward 
approach, and are widely used.  For example:

```css
p { border-color: black;
	border-width: 4px;
	width: 88px; }
```


###%

Using `%` can be a little tricker than pixels
because it relies on the selected element's 
parent value, and sets the specified 
percentage of that value.  For example:

```css
strong { font-size: 120%; }
p { width: 50%; }
```


###em

The unit `em` is also relative and depends on
the element's `font-size` value.  For example, 
if a parent element has a `font-size` of `20px`
`font-size: 0.8em` is applied to a child 
element, the child element will have a 
`font-size` of `16px`.

Similar to the `em` unit is the `rem` unit
which depends not on the element's `font-size`
but that of the *root element*.


##CSS Reset

Each browser has its own set of styling rules
that are used by default and are simply 
overridden by styles applied via CSS rules.
In other words, there is no such thing as a
truly unstyled element because elements without
explicit styling rules applied just get the 
browser's default styling applied.  This 
can cause problems, because each browser
might have slightly different default styling
rules.  For this reason, it is usually a good
idea to use a **CSS Reset** - a file that sets
just the right CSS rules to ensure a consistent
default styling across browsers.  A CSS reset
file usually will remove margins and padding
on all elements, set a default `font-size`, etc.

Eric Meyer's reset.css is considered a
canonical CSS reset file:
http://meyerweb.com/eric/tools/css/reset/reset.css


##CSS Fonts

Picking a font is important for the styling
of HTML content, but it has to be done 
carefully because different devices and 
different operating systems have different sets
of fonts installed by default.  So the value
for the `font-family` property can list the 
preferred fonts in priority order:

```css
body { 
	font-family: Segoe UI, Helvetica, 
				 Arial, sans-serif; 
}
```

The above rule sets a preference for the 
Segoe UI font, but in its absence the browser
can use Helvetica.  If both are missing the 
browser should try Arial.  If none of the 
three are found, the browser can pick a
sans-serif font to be used.

In addition to the `sans-serif` family there
is a `serif` and `monospace` family for
those font types.

As the previous examples have shown, the
`font-size` property sets the size of fonts
using one of the CSS units.  The `color`
property sets the color of text using a 
named color, or any of the other color 
specs.  The `font-style` property can be
set to the value `normal` or `italic`.
The `font-weight` property can be set
to `normal` or  `bold`. 
The `text-decoration` property can
be set to `underline`, `overline`, or 
`line-through`.
Below is an example combining these font
and text properties:

```css
span.important {
	color: #333333;
	font-family: Arial, sans-serif;
	font-size: 14px;
	font-weight: bold;
	font-style: italic;
	text-decoration: underline;
}
```

