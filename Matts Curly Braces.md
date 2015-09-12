#Curly Braces

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

CSS works by *selecting* 
an element and then specifying a 
property of the selected element(s)
followed by a value to apply for that
property.  The general
syntax is:

```css
selector { property: value; }
```

Another way to think about the syntax
is "who, what, and how".  The "who"
is the selector, or who is targeted
for applying styles.  The "what" is 
what property to be set on the "who".
And the "how" is how to set that
property.

As a concrete example, to set the background
color of all paragraph elements to 
gainsboro, the following CSS would be used:

```css
p { background-color: gainsboro; }
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

Multiple rules are simply listed one
after the other:

```css
p {
	background-color: gainsboro;
	color: darkblue;
}

a {
	background-color: light-salmon;
	color: maroon;
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
element in the `<head>` element:

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

But the preferred method is to place
CSS in a separate file,
with a .css extension, and link to it
using a `<link>` element in 
the HTML document's `<head>`.  For 
example, assume we had this in a file
named "style.css" and it was in the same
folder as our HTML document:

```css
p { background-color: gainsboro; }
```

Then the HTML file would need a 
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
keeping CSS in a separate file also provides improved 
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
self-contained examples.  But for
"real" HTML documents this goes against
best practices, which keep CSS documents in
separate files, using `<link>` elements to 
apply them.

 
##CSS Selectors

####Tag names

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

####Classes

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


####IDs

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

####Descendant selector

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

####Child selector

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


####Combining selectors
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
| ------------- | ------------------------------------------------------------
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


####Pseudo-class selectors

Elements can have different states 
that can be selected by psuedo-class
selectors.  For instance, a link
is usually in its normal state, but
when the user hovers the cursor over
the link it is in a "hover" state, 
and a different set of styling rules
may be applied.  To do this, the
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
<p class="message" id="firstparagraph">
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
the rules, a rough score can be applied, where `#`
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


####rgb

Colors can be defined by their amounts
of red, green, and blue components.  So
pure blue is 100% blue, 0% green, and
0% red.  Purple would be 100% blue and 100%
red with 0% green.  Black is 0% red,
green, and blue.  White is 100% of all
three.  But rather than using whole 
number percentages (0 through 100), 
CSS allows a color
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


####rgba

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


####rgb hex values
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


####px

Using pixels is the most straightforward 
approach, and are widely used.  For example:

```css
p { border-color: black;
	border-width: 4px;
	width: 88px; }
```


####%

Using `%` can be a little tricker than pixels
because it relies on the selected element's 
parent value, and sets the specified 
percentage of that value.  For example:

```css
strong { font-size: 120%; }
p { width: 50%; }
```


####em

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
`line-through`.  The `text-align` property
can be `left`, `right`, `center` and 
`justify`.  The `text-indent` property
takes a CSS size value, and specifies an
indentation amount (first line only is
indented).  The `text-shadow` property takes
three sizes for x-offset, y-offset, and blur
and then a CSS color.
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
	text-align: justify;
	text-shadow: 1px 2px 5px #777777;
}
```

CSS allows some "shorthand" properties
to set several related properties at 
once.  The `font` property is one such
shorthand property:

```css
body { font: bold 16px/1.5 Arial, sans-serif; }
```

This shorthand method allows setting up
to six font properties at once. Values 
must be specified in exact order, but
only the `font-size` and `font-family`
are required.  The benefit of these shorthand
properties is questionable, but their use 
is fairly widespread, so some familiarity
with them is useful.


##CSS Box Model
Every HTML element, both block and inline,
is rendered in the browser as a rectangle.
By default the rectangles are rendered
in a fluid manner, adjusting their height
and width to fit the content they contain,
and their positions to flow with other 
elements around them.  For instance, a
`<p>` element (or any other block element)
will by default take up 100% of the 
width of the browser window, whether that
browser window is maximized on a large 
desktop display, or is on a puny phone. 
The height of the `<p>` element fluidly
adjusts accordingly, and a sibling block
element's rectangle is drawn below the 
bottom of the `<p>` element's rectangle,
regardless of the vertical height it 
consumes. The rectangular nature of HTML
elements is often referred to as the
**box model**.

Several CSS properties come into play 
in rendering an element's rectangle,
including `background-color`,


####background-color
As illustrated in previous examples,
to set the color of an element's
background, use the `background-color`
property (overriding the default 
color of `transparent`):

```css
body { background-color: #777777; }
```

A `background-image` can also be used,
by specifying a relative url to the image
(relative to the CSS file, not necessarily
relative to the HTML document).  The
`background-repeat` specifies whether
the image should be rendered once (`no-repeat`)
or if it should be repeated vertically
only (`repeat-y`), repeated horizontally
only (`repeat-x`), or both (`repeat`, the
default):

```css
body { 
	background-image: url(img/watermark.png); 
	background-repeat: no-repeat;	
}
```

In addition to solid colors and images,
gradients can be used:

```css
body { background-image: linear-gradient(white, blue); }
```

See MDN documentation for more info on
creating `linear-gradient`s and 
`radial-gradient`s.


####display

Several examples and explanations above
have mentioned the difference between a
block element and an inline element.
CSS makes changing the behavior of these
elements a simple property assignment.
For instance, to turn some navigation 
links (`<a>` element is normally an inline
element) into block elements:

```css
nav a { display: block; }
``` 

Or to make an element inline:

```css
li { display: inline }
```

Another common value for the `display` 
property is `none` which renders the document
as if the element were not there.  There is
also a `visibility` property which can be set
to `hidden`, but note the important difference
between `visibility: hidden` and `display: none`.
Hiding visibility is like making it completely
transparent, but it still takes up space in
the document flow.  Setting an element's `display`
to `none` effectively removes the element from the 
document flow entirely:

```html
<!doctype html>
<html>
	<head>
		<title>Testing display/visibility</title>
		<style>
			p.hidden { visibility:hidden; }
			p.nodisplay { display:none; }
		</style>
	</head>
	<body>
		<p>Paragraph 1</p>
		<p>Paragraph 2</p>
		<p class="nodisplay">Paragraph 3</p>
		<p>Paragraph 4</p>
		<p>Paragraph 5</p>
		<p class="hidden">Paragraph 6</p>
		<p>Paragraph 7</p>
	</body>
</html>
```

As mentioned above, a block element by default
takes up 100% of available width, and whatever
height is required to show all its content.
When necessary, it is easy to override this
default behavior.  The `width` property takes
a CSS size value and sets the width of a
block element to exactly that size:

```css
p { width: 100px; }
```

In the above situation, paragraphs will extend
horizontally to a 100 pixel width.  The height
will still dynamically adjust to display all
of the `<p>` element content.

The `height` property can also be set:

```css
p { width: 100px; height: 40px; }
```

When both height and width are specified, the
element no longer dynamically expands to display
all its content.  Instead, the element itself
may be larger or smaller than what is required
to display the content.  In the case that it is
too small, the content is displayed anyway, but
*overflows* the element:

```html
<!doctype html>
<html>
	<head>
		<title>Testing fixed height and width</title>
		<style>
			p { 
				height: 80px; 
				width: 280px;
				background-color: lightsalmon; 
			}
		</style>
	</head>
	<body>
		<p>
			Lorem ipsum dolor sit amet.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur 
			adipiscing elit, sed do eiusmod tempor 
			incididunt ut labore et dolore magna aliqua. 
			Ut enim ad minim veniam, quis nostrud 
			exercitation ullamco laboris nisi ut 
			aliquip ex ea commodo consequat. Duis aute 
			irure dolor in reprehenderit in voluptate 
			velit esse cillum dolore eu fugiat nulla 
			pariatur. Excepteur sint occaecat cupidatat 
			non proident, sunt in culpa qui officia 
			deserunt mollit anim id est laborum.
		</p>
	</body>
</html>
``` 

The CSS `overflow` property allows easy
management of this situation.  The default 
value (`visible`) is rarely desirable, but other
possible values are `hidden` (chop off content
if it overflows its element), `scroll` (allow
scrollbars to enable content to remain inside
element), and `auto` (add scrollbars only if
needed).  Using the HTML in the example above,
notice how each of the following CSS rules
changes the `<p>` elements:

```css
p { height: 80px;width: 280px;background-color: lightsalmon; 
	overflow: hidden;
}
p { height: 80px;width: 280px;background-color: lightsalmon; 
	overflow: scroll;
}
p { height: 80px;width: 280px;background-color: lightsalmon; 
	overflow: auto;
}
```

####Borders

Each element's rectangle has a border.  By 
default, the border is not visible, but often
it is desirable to add the styling to make it 
visible through the three main properties:
`border-color` (value is a CSS color), 
`border-style` (value is `solid`, `dashed`, etc.)
and `border-width` (value is a CSS size).

```css
p {
	border-color: black;
	border-width: 4px;
	border-style: solid;
}
```

The border can also be specified for individual
sides of the rectangle using the properties
`border-top`, `border-right`, `border-bottom`
and `border-left`:

```css
p {
	border-top-color: black;
	border-top-width: 4px;
	border-top-style: solid;
	border-bottom-color: blue;
	border-bottom-width: 12px;
	border-bottom-style: dashed;
}
```

There is a shorthand property for `border`,
which has just three values, so unlike `font`
it is easy to remember and therefore useful.
It sets the `border-width`, `border-style`,
and `border-color` in that order:

```css
p { border: 2px solid #556677; }
```

####Padding

In the border examples above it may have
been noticeable that the border and the 
content of an element were uncomfortably
close to each other.  There is actually 
another property for styling the CSS box
model that defines the space between the
content and border:  `padding`.

```css 
p {
	background-color: gainsboro;
	border: 4px solid #556677;
	padding: 12px;
}
```

Notice that the background color fills
the padding, right up to the border.

Padding can also be applied to a specific
side:

```css
p {
	background-color: gainsboro;
	border: 4px solid #556677;
	padding-top: 12px;
	padding-right: 200px;
	padding-bottom: 0;
	padding-left: 50px;
}
```

Or all side sizes can be specified with
spaces between them, starting with `top`
and going clockwise.  So this rule is the
same as the example above:

 
```css
p {
	background-color: gainsboro;
	border: 4px solid #556677;
	padding: 12px 200px 0 50px;
}
```

Using two values instead of four will apply
the first value to the top and bottom and 
the second value to the right and left:

```css
p {	
	background-color: gainsboro;
	border: 4px solid #556677;
	padding: 12px 80px;
}
```


####Margin

The `margin` CSS property adds space to the
box model *outside* of the border in the 
same way `padding` adds space *inside* of 
the border:

```css
body { background-color: black; }
p { 
	background-color: gainsboro;
	border: 4px solid #556677;
	padding: 12px;
	margin: 35px;
}
```

Margins have can be per-side just like
the `padding-*` properties and can use
the shorthand values (top right bottom left)
as well.

Margins have the slightly less intuitive 
behavior of *merging*.  In the CSS example
above, a `margin: 35px` is set, but two
sibling `<p>` elements would be spaced 35
pixels apart rather than 70.  That's because
a margin is the *minimum space* to keep between
an element and other elements.  This is 
an important behavior to remember.


##CSS Positioning
By default, an HTML document allows elements
to flow - block elements take up all 
horizontal space, inline elements flow with
other content within their parent element,
and elements are rendered in the order in 
which they appear in the HTML.  But sometimes
it may be desirable to break the flow and
take control over the positioning of elements
using CSS.  This can be done with the 
`position` property, which can have 4 values:
`static` (default, content flows normally),
`relative` (moves the element relative to 
what its static position would be), `absolute`
(moves the element according to its first
positioned ancestor) or `fixed` (moves an
element to an always-fixed location so it 
will not scroll with the page).


####relative

Setting `position: relative` will break an 
element out of normal flow, allowing it to 
be positioned relative to where it would be 
if it *were* in normal flow.  The specifics
of the relative positioning are specified by
the `left`, `top`, `right`, and/or `bottom`
properties, whose values are CSS sizes and
measure the distance of the rectangle from
its "static" position.  Here is a complete
example:

```html
<!doctype html>
<html>
	<head>
		<title>Testing relative positioning</title>
		<style>
			p { 
				background-color: gainsboro;
				border: 4px solid #334455;
				padding: 8px;
				margin: 8px;
			}
			
			p.middle {
				position: relative;
				left: 50px;
				top: 25px;
			}
		</style>
	</head>
	<body>
		<p>
			Lorem ipsum dolor sit amet.
		</p>
		<p class="middle">
			Lorem ipsum dolor sit amet.
		</p>
		<p>
			Lorem ipsum dolor sit amet.
		</p>
	</body>
</html>
```

In the example above, the "middle" paragraph
is shifted 50 pixels *from the left* and 25
pixels *from the top* relative to where it 
normally would be.  Other elements continue to 
flow in the document as if the 
relatively-positioned element
were in its normal place.  So the third 
paragraph doesn't know anything has moved
out of its natural place.


####absolute

When an element's position is  `absolute`, its
location can be set based on its nearest
ancestor whose position is not `static`.
When this is the case, the element that is
`absolute` can have its `top`, `left`, `right`,
and/or `bottom` property set, which specify
the exact position of the element within its
non-static ancestor:

```html

<!doctype html>
<html>
	<head>
		<title>Testing relative positioning</title>
		<style>
			#container {
				position: relative;
				height: 400px;
				background-color: #334455;
				color: white;
			}
			.abspos { 
				position: absolute;
				top: 200px;
				left: 400px;
				background-color: gainsboro;
				color: black;
				border: 4px solid white;
				padding: 8px;
			}
		</style>
	</head>
	<body>
		<div id=container>
			This is relatively positioned
			<p class="abspos">
				This is absolutely positioned
			</p>
		</div>
	</body>
</html>
```


The `<div>` in the example is set to 
`position: relative` so that it is not static
and ancestors can be positioned absolutely 
within it.  Because there are no `left`, 
`right`, `top`, or `bottom` values specified
to go along with the `position:relative`, the
`<div>` is displayed in its natural position,
the same as if it were `position:static`.  But
by virtue of the `relative` position, the `<p>`
descendant can be set to `position: absolute`
and then can specify `left` and `top` values
to position itself precisely within the 
`<div>`.


####fixed

Setting an element to `postion:fixed` allows
`left`, `right`, `top`, and / or `bottom`
values which will affix the element at those
locations in the window rather than the
document.  Here is an example illustrating
`fixed` positioning, as well as several other
concepts covered previously:

```html
<!doctype html>
<html>
	<head>
		<title>Testing fixed positioning</title>
		<style>
			body {
				padding: 0 200px;
				font-family: Segoe UI, sans-serif;
			}
			
			p { 
				background-color: gainsboro;
				border: 4px solid #334455;
				padding: 80px;
			}
			
			nav {
				position: fixed;
				left: 18px;
				top: 18px;
				background-color: #334455;
				color: white;
				width: 150px;
			}
			
			nav a {
				display: block;
				padding: 20px 10px;
			}
			
			nav a:hover {
				background-color: gainsboro;
				color: black;
				text-decoration: underline;
			}
			
			aside {
				position: fixed;
				width: 100px;
				height: 400px;
				top: 18px;
				right: 18px;
				border: 8px dashed black;
				padding: 20px;
			}
		</style>
	</head>
	<body>
		<nav>
			<a>Nav link 1</a>
			<a>Nav link 2</a>
			<a>Nav link 3</a>
		</nav>
		<aside>
			Lorem ipsum dolor sit amet
		</aside>
		<p>Lorem ipsum...</p>
		<p>Lorem ipsum...</p>
		<p>Lorem ipsum...</p>
		<p>Lorem ipsum...</p>
		<p>Lorem ipsum...</p>
		<p>Lorem ipsum...</p>
		<p>Lorem ipsum...</p>
	</body>
</html>
```

The `<nav>` above is in a fixed position on
the window, even as the document is scrolled.
The `<body>` uses padding on the left to 
keep content out of the way of the `<nav>`.


##Advanced CSS

Advanced CSS topics not covered here 
include:

 - The `float` property
 - Pseudo-classes in addtion to `:hover`
 - Color gradients
 - Transitions
 - Animations
 - Transforms
 - Responsive design
 

##CSS Frameworks

There are many useful and powerful CSS
frameworks that are freely available, 
attractive, and easy to learn and use.
Here are some popular ones:

 - Twitter Bootstrap:  http://getbootstrap.com
 - Zurb Foundation: http://foundation.zurb.com
 - Pure CSS http://purecss.io
 
 
##Developer Tools

Every modern browser comes with excellent 
developer tools built in, which can be 
accessed with the F12 key on a Windows PC.  
These developer tools are indispensible in 
debugging CSS styling and layout problems. 
Consult the documentation for each browser:

 - Internet Explorer: https://msdn.microsoft.com/library/bg182326(v=vs.85)
 - Firefox: https://developer.mozilla.org/en-US/docs/Tools
 - Chrome: https://developer.chrome.com/devtools
 
There is also a well-known and highly 
regarded plugin for Firefox called Firebug
that can probably be credited with kickstarting
the browser vendors into including developer
tools by default.  It has remarkable features
and is worth learning: http://getfirebug.com

