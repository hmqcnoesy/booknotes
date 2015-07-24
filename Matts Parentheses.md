#Parentheses

##JavaScript
JavaScript is a lightweight scripting language
that was designed for use in web browsers.
In an HTML document loaded by a browser, 
JavaScript can be used to control that document
and provide otherwise impossible interactivity
with the user.  All web browsers are 
JavaScript-capable.

JavaScript is ubiquitous.  It is arguably
the most widespread and popular language in
the world.  Although it has been much 
maligned in the past (fairly or not), today
it is widely regarded as a solid language 
with many great features.

JavaScript is *not* Java.  The two languages
have a common syntactical ancestry but are 
otherwise unrelated.  A Java installation is not 
necessary for a browser to run JavaScript.
Content built on web technology standards
(HTML, CSS, JavaScript) has no dependency 
whatsoever on Java.


##First JavaScript example

Here is an example of some JavaScript code
that when executed, will open a message box
with the text "Hello from JavaScript!":

```javascript
alert('Hello from JavaScript!');
```

The details on syntax (parentheses, single 
quotes, semicolons, etc.) will be detailed 
later.  For now, it is important only to get
a simple example working to see how to
include JavaScript in a document.

Like CSS, JavaScript can be added to an
HTML document directly.  JavaScript can 
be placed anywhere in the document, in
a `<script>` tag.  Notice in the example 
below that the JavaScript code is not in
any way rendered with the content of the 
page, but is executed when the page is 
loaded:

```html
<!doctype html>
<html>
	<head>
		<title>First JavaScript Example</title>
	</head>
	<body>
		<h1>First JavaScript Example</h1>
		<script>
			alert('Hello from JavaScript!');
		</script>
		<h2>This comes after the script</h2>
	</body>
</html>
```

And like CSS, it is considered
best practice is to put 
JavaScript code in separate files, then 
reference those files in the HTML document.
CSS used a `<link>` element in the HTML `<head>`
but in the case of JavaScript, a `<script>`
element can be placed in the head or body, and
the `src` attribute tells the browser the 
absolute or relative URL of the JavaScript 
file.  Unlike a `<link>` element for CSS,
a `<script>` element is not self-closing and
*must* have a closing `</script>` tag.  Also,
unlike a `<link>` element which must be placed
in the `<head>` the `<script>` element can
be anywhere in the HTML document, and the
JavaScript file will be retrieved and 
executed immediately when the `<script>` 
element is encountered by the browser.
For this reason, it is considered best 
practice to place all `<script>` elements
at the bottom of the document, just before
the closing `</body>` tag:

```html
<!doctype html>
<html>
	<head>
		<title>First JavaScript Example</title>
	</head>
	<body>
		<h1>First JavaScript Example</h1>
		<h2>This comes after the script</h2>
		<script src="hello.js"></script>
	</body>
</html>
```


##JavaScript Building Blocks

JavaScript, as other languages, makes use of 
different types of data.  One of the most 
common data types is the **number** 
(`0`, `42`, `3.14159`, etc.).  Another of the
most common types is the **string** 
(`'hello'`, `'goodbye'`, `'ಠ_ಠ'`, etc.).

Programs need to be able to *create* and 
*remember* values while they are executing.
**Variables** are created to do this.  In 
JavaScript a variable is created by using 
the keyword `var` followed by a name (made
of letters and numbers, no spaces) for the
variable and then `=` and an assignment for 
the variable's value.  This JavaScript 
variable declaration (or any JavaScript 
statement for that matter) is then finished
with a `;` character.  For instance:

```javascript
var myAge = 38;
```

Math works as one might expect.  The `+`, `-`,
`*` and `/` operators work on numbers.  This 
example creates two variables, performs some
math on the variables' values, and displays 
a message box with the calculation result.
Notice how JavaScript ignores excess 
whitespace in the calculation:

```javascript
var myAge = 38;
var kid1Age = 10;
var kid2Age = 8;
var kid3Age = 5;
var kid4Age = 3;
var averageKidAge = 
	(kid1Age + kid2Age + kid3Age + kid4Age) / 4;
var diff = myAge - averageKidAge;

alert(diff);
```

In JavaScript, a variable's value can be
reassigned to any value at any time, not 
by redeclaring the variable with `var`, but
by simply using the assignment operator to
assign it a new value:

```javascript
var area = 100;
var radius = 2;
area = radius * radius * 3.14159;
alert(area)
```

In the example above, the `area` variable
is assigned a value of 100, but then is 
assigned a new value that is the result
of an expression evaluation.  The `alert()`
shows that after that assignment, the 
value of `area` is 12.56636.

Creating a string variable is done similarly
but a string value is wrapped in quotes:

```javascript
var myMessage = 'A very merry unbirthday to you';
```

Strings can be wrapped with double quotes as
well:

```javascript
var myMessage = "this works too";
```

What if a string needs to contain one of those
characters that is used to wrap a string?  When
the code is executed, how does the computer 
know that that character isn't the end of the
string?

```javascript
alert('this isn't gonna work!');
```

The line of code above is indeed broken because
the `'` character in the work "isn't" ends the
string, and the remainder of the statement 
becomes pure jibberish as far as the computer
is concerned.  So double quotes as the string
delimiter would work fine:

```javascript
alert("this isn't gonna fail.");
```

If needed, a `\` character can precede and 
escape another character:

```javascript 
alert("I said, \"this'll work\"!");
```

The `+` operator can be used not just with 
numbers, but strings too, where it 
*concatenates* two strings together:

```javascript
alert('Java' + 'Script ain\'t ' + 'Java.');
```

The **boolean** is another data type in 
JavaScript.  A boolean can be `true` or
`false` and can be set directly in a 
variable declaration:

```javascript
var jsIsGood = true;
var cssIsEasy = false;
```

Or a boolean value is often the result of
the evaluation of an expression:

```javascript 
var isTwoMoreThanOne = 2 > 1;
var isTwoLessThanOrEqualToOne = 2 <= 1;
```

Notice the comparison operators used above.
Other comparison operators include the 
"is equal" operator `==` and "is not equal"
`!=`.  The double character in the `==`
operator is required because a single `=`
is the assignment operator, used for variable
assignments.


##Branching
Program code needs to be able to make
decisions, executing different paths depending
on the decisions.  A simple way to accomplish
this type of branching is with the `if`
statement in JavaScript:

```javascript
var isTwoMoreThanOne = 2 > 1;

if (isTwoMoreThanOne) {
	alert('Math still works ok');
}
```

Above, the variable `isTwoMoreThanOne` is 
assigned a value that is the result of the
evaluation of the expression `2 > 1`.  Two is
indeed greater than one, so the variable value
is `true`.  Then the `if` statment evaluates
this variable.  Since the value is `true`, the
code in the block - the code following the `if`
between the `{` and `}` is executed.  If the
variable assignment were `false`, the code in
the block would not be executed.

A variation on `if` is the `if-else` construct:

```javascript
if (1 > 2) {
	alert('The universe is in trouble');
} else {
	alert('Everything is fine');
}
```

The above example forgoes the use of a variable
and puts the expression to be evaluated directly
in the `if` statement, which works perfectly 
well.  Since the expression evaluates to `false`
the code in the block immediately following 
the `if` does *NOT* get executed, rather the 
code block following the `else` *does*.

Another variation on `if` is the `if-ifelse`
construct:

```javascript
var age = 38;
if (age > 40) {
	alert('You must like Super Mario Bros.');
} else if (age > 30) {
	alert('You must like Doom.');
} else if (age > 20) {
	alert('You must like Halo.');
} else {
	alert('You must like Candy Crush.');
}
```

Above, the age variable is evaluated against 
different numbers.  Once an expression is
evaluated to `true`, code continues within
that block, then jumps outside the `if`
statement.  So with the value `38` for `age`
the above code would display just one alert
that says "You must like Doom."

The boolean `&&` (and) operator and `||` (or)
operator can be used to evaluate more complex
expressions:

```javascript
var jsIsGood = true;
var jsIsEasy = false;

if (jsIsGood && jsIsEasy) {
	alert('good and easy');	
}

if (jsIsGood || jsIsEasy) {
	alert('one or the other or both');	
}
```

The above code will alert just "one or the 
other or both".

The `!` operator used before an expression
will negate it:

```javascript
var jsIsGood = true;
var jsIsEasy = false;

if (jsIsGood && !jsIsEasy) {
	alert('JavaScript training is the right thing to do');	
}
```

Above, the alert is shown because the value
of `jsIsGood` is `true` and the value of 
`jsIsEasy` is `false` and so the value of
`!jsIsEasy` is `true` and therefore the 
value of `jsIsGood && !jsIsEasy` is also `true`.

