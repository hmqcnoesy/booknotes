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
		<h2>This comes before the script</h2>
		<script src="hello.js"></script>
	</body>
</html>
```


##JavaScript Variables

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


##Looping

JavaScript offers the typically expected
looping constructs.  Specifically, the
`while`, `do-while`, and `for` loops.

####while
The block within a while loop repeats 
so long as the expression in parentheses
evaluates to `true`.  The evaulation
occurs before execution begins in the 
block:

```javascript
var count = 0;

while (count < 3) {
	alert(count * count * count);
	count++;
}

alert('That\'s enough cubes!');
```

The code example above will display
an alert 3 times, showing the cubes
of numbers 0 through 2.  The `++`
operator increments the variable
to which it is applied by one.  This
way, the evaulation of the expression
`count < 3` eventually results in a
value of `false` (when `count` is 3),
at which point code execution 
continues after the `while` block.


####do-while

To execute a loop where the text
expression is executed after the
loop's code block executes, use the
`do-while` loop.  It ensures the
code within the block will execute
at least once (where as a `while`
loop will not execute if the first
time the text expression evaluates 
to `false`):

```javascript
var count = 0;
do {
	alert('this alert shows once');
	count--;
} while (count > 0);
```

The `--` operator decrements the 
variable it is applied to by one.
The code in the `do` loop block
executes once because the test
expression is evaluated *after* the
block execution.


####for

The `for` loop is most common
and uses three expressions: an
initialization expression (executed
*once* at beginning), a test
expression (evaulated at the beginning
of each time through the loop to test
whether to execute the loop's code
block) and an increment expression
(executed at the end of each time
finishing execution of the loop's 
code block):

```javascript
var sum = 0;
var count = 100;

for (var i = 0; i <= count; i++) {
	sum = sum + count;
}

alert(sum);
```


##JavaScript Functions

A *function* defines a block of code
that is reusable (can be invoked
as needed from other locations in
code).  A function might require
input(s) in the form of *parameters*
that are fed to the function when 
invoked.  And a function might 
return some information to the code
that invokes it in the form of a
*return value*.

Using functions helps not just with
readability, it helps with organization
of code, because it can independently
implement some (possibly complex)
functionality, invocable by an easily
remembered, human-readable name.  Best
of all functions are easy to declare.
Here is code that utilizes a function 
to calculate cubes:

```javascript
function getCube(input) {
	var cube = input*input*input;
	return cube;	 
}

var result = getCube(3);
alert(result);
result = getCube(4);
alert(result);
```

Here the `function` declaration shows
that the function name is `getCube`
which is how the function can be
invoked.  The declaration also shows
that a parameter should be passed when
the function is invoked.  The name 
given to the parameter is `input`.
Then the code in the function's curly
braces defines exactly what will 
execute when the function does get 
invoked.  When invoked, a variable
named `cube` is created and set to a 
value that is the `input` value passed
in, cubed.  The `return` statement
specifies the value that is the
output of invoking the function, in
other words, the value that is handed
back to the expression invoking the 
code.

A function can make use of multiple
parameters - their names are separated
by commas in the function declaration,
and the values passed in when the function
is invoked are also separated by commas:

```javascript
function sayHello(firstName, lastName) {
	alert('Hello, ' + firstName + ' ' + lastName);	
}

sayHello('Mark', 'Twain');
sayHello('Darth', 'Vader');
```

Notice also in the example above the
lack of a `return` statement - this function
does not return a value, and the code
that invokes the function does not expect
one.

Notice also that the examples above have
been repeatedly invoking `alert()`, which
is itself just another function, albeit a
built-in one.

It is important to understand how the 
parameters are handled when invoking a 
function.  The parameters are passed
*by value* which means a copy is made
especially for the function invocation 
to use.  The code that invokes the function
passes a value that is untouched by the
function execution.  Here is an example
to illustrate this point:

```javascript
function addOne(input) {
	input = input + 1;
	return input;
} 

var value = 6;
var returnedValue = addOne(value);
alert('value is ' + value);
alert('returned value is ' + returnedValue);
```

The example above alerts `6` first, then
`7`.  Note that the 6 value that is 
passed to the `addOne` function is 
*copied* so that the addOne function when
it executes cannot modify the invoker's
copy of any value passed.  If it were so,
the first alert would show `7`.

The end result of the pass-by-value 
behavior is that a function can modify
only a copy of values that are passed to
it, and can never modify the original
variable passed to the function.  A
misunderstanding of this behavior can
result in some serious difficulty down
the road, so it is wise to ensure a 
proper grasp of the concept early on.

It might go without saying, but functions
can have no parameters, which just means
they need no input from code that invokes
them in order to perform their job:

```javascript
function getUserName() {
	var userName = prompt('What\'s your name?');
	return userName;	
}
```

In the above example, the built-in `prompt()`
function is similar to `alert()` except
that it has a text box where the user can
type in some input, which becomes the
return value of the function call.

Another behavior of JavaScript functions
is that they provide **scope**.  A scope
is the portion of code in which a variable
lives.  Outside of its scope, a variable
doesn't exist.  For example:

```javascript
function getCube(input) {
	var cubedValue = input*input*input;
	return cubedValue;	
}

var answer = getCube(3);
alert(cubedValue);
```

The code aboves alerts **undefined** 
because there has been no `cubedValue`
variable defined in the scope where
the `alert` function is invoked.  The
`cubedValue` variable is defined 
within the `getCube` function, so it 
is limited to that scope, i.e. it 
exists only within the `getCube`
function code.

Variables that are declared outside
of functions have **global** scope,
meaning they are accessible everywhere:

```javascript
var points = 0;

function scorePoint() {
	points++;	
}

alert(points);
scorePoint();
alert(points);
```

The above example illustrates how
a variable declared in the global
scope (`points`) can be accessed
inside and outside of functions.
It exists as long as the HTML 
document that loaded it is alive.

##JavaScript Arrays

An array in JavaScript works as a
list of variables all stored together.
An array is created using `[]`
characters.  Accessing an item in
a particular position in the array
variable requires the 0-based index
of the item in the square brackets:

```javascript
var thingsToForget = ['http', 'html', 'css', 'javascript'];
alert(thingsToForget[0]); // alerts "http"
alert(thingsToForget[3]); // alerts "javascript"

thingsToForget[3] = 'java';
alert(thingsToForget[3]); // alerts "java"
```

It is easy to loop through the contents 
of an array using a `for` loop, and by
using the array's `.length` property in
the loop's "test":

```javascript
var numbers = [1,2,3,5,8,13,21,34,55,89];

var sum = 0;

for (var i = 0; i < numbers.length; i++) {
	sum = sum + numbers[i];
}

alert('sum of all those numbers is ' + sum);
```


##JavaScript Objects

An object is a container full of 
**members**.  Members are variables 
that can 
be of any of the data types discussed
previously, including functions
(in which case they are referred to 
as **methods**).  These members are
grouped together in an object because
they belong
together.  They often model some
real-world object.  The simplest
syntax for creating an object is 
to use `{}` in a variable assignment
and as follows:

```javascript
var fred = {
	firstName: 'Fred',
	lastName: 'Doe',
	age: 38,
	height: 72,
	alive: true,
	sayHi: function() {
		alert('Hello, my name is Fred.');	
	},
	sayBye: function(times) {
		var msg = '';
		for(var i = 0; i < times; i++) {
			msg = msg + 'Goodbye. ';	
		}
		alert(msg);
	}
};
```

Accessing the members of an object
is acccomplished using the `.` operator:

```javascript
fred.sayHi();
alert(fred.height);
fred.sayBye(3);
```

JavaScript implmentations include some
handy built-in objects, such as the `Math`
object that has lots of math-related
methods:

```javascript
var ans = Math.sqrt(1000000);
alert('The square root of a million is ' + ans);
```

And the `console` object that has the handy
`log()` method, which writes messages to the 
console.  That is a lot less annoying than those
alerts that have to be dismissed every time,
so let's start using `console.log()` instead
of `alert()` now that objects and the `.` 
operator have been covered:

```javascript
console.log('What is the length of the hypotenuse ');
console.log('of a right triangle having sides of ');
console.log('length 3 and 4?');
var ans = Math.sqrt((3*3) + (4*4));
console.log('The answer is ' + ans);
```

There is also the `window` object which
refers to the browser window and has
some useful and interesting members:

```javascript
console.log(window.innerWidth);
console.log(window.innerHeight);
console.log(window.outerWidth);
console.log(window.outerHeight);
window.open("http://www.google.com");
```

And perhaps most importantly, the `document`
object, which refers to the currently
loaded HTML document in the browser.
This object is the key to interacting with
a user's input and the elements within
an HTML document.  The `getElementById()`
method is used extensively when interacting
with document content.  It does exactly
what it sounds like: gets a handle on
one specific element in the HTML document,
whose `id` attribute value matches the 
value passed into the method.  The return
value of the method is an element object
which itself has members, such as the
`innerHTML` property which can be set,
dynamically changing the content of the
element:

```html
<!doctype html>
<html>
	<head>
		<title>document getElementById example</title>
	</head>
	<body>
		<h1>First JavaScript Example</h1>
		<p id="onlyparagraph">
			This is the only paragraph
		</p>
		<script>
			var paragraph = document.getElementById('onlyparagraph');
			paragraph.innerHTML = 'This content was set using JavaScript';
		</script>
	</body>
</html>
```

A common need is to be able to react to
user changes to values of `input` elements,
or user clicks to `button` elements, etc.
The element object returned by `getElementById()`
has an `addEventListener()` method that
exposes this type of functionality.  The
method takes a string telling the type of event
(`click` for instance), then a function parameter
detailing the code to run when the event occurs.
For example:

```html
<!doctype html>
<html>
	<head>
		<title>addEventListener example</title>
	</head>
	<body>
		<input type="text" id="lhs" value="34" />
		<input type="text" id="rhs" value="59" />
		<button id="btnAdd">Add</button>
		<p id="onlyparagraph">
			This is the only paragraph
		</p>
		<script>
			function AddNumbers() {
			    var lhsValue = +document.getElementById('lhs').value;
			    var rhsValue = +document.getElementById('rhs').value;
			    var paragraph = document.getElementById('onlyparagraph');
			    paragraph.innerHTML = lhsValue + rhsValue;
			}
			
			var button = document.getElementById('btnAdd');
			button.addEventListener('click', AddNumbers);
		</script>
	</body>
</html>
```

Using the members of the `document` object,
*anything* within the document can be 
manipulated:  elements can be added, removed,
edited, rearranged, etc.  Attributes can too.
Any info in the document can not only be 
retrieved, it can also be set, and when it is
set, the browser automatically updates the
visual representation of the document to 
reflect that change.  This type of functionality 
is made easier with the JavaScript library
jQuery.


##jQuery

jQuery is an enormously popular library that 
focuses on easy interaction with the document
object model (the **DOM**, or the tree of 
elements in the document).  It also
has an expandable plug-in model.  Thousands
of jQuery plugins are just a google search away. 

The easiest way to use jQuery in an HTML 
document is to just reference the jQuery 
JavaScript file hosted by the kind folks at
jQuery.  Notice in the example below that
the `script` which references the jQuery
JavaScript must come before any custom code
that makes use of jQuery.  
The first thing jQuery provides is a shorthand
way of executing code only once the document is
completely loaded by the browser and the document
is ready to listen to code that might change it::

```html
<!doctype html>
<html>
	<head>
		<title>jQuery example</title>
	</head>
	<body>
		<p id="onlyparagraph">
			This is the only paragraph
		</p>
		<script src="http://code.jquery.com/jquery-2.1.4.js"></script>
		<script>
			$(function() {
				alert('jQuery helped me do this');
			});
		</script>
	</body>
</html>
```

The most powerful feature of jQuery is its ability
to get elements from the DOM based on queries that 
mimic CSS selectors.  Instead of using the method
`document.getElementById`, with jQuery one would 
use the `$()` function, passing in a CSS selector 
string.  The return value from this function call
is a jQuery-wrapped set, which is a collection of
all the elements that matched the selector.  The
jQuery-wrapped set object then in turn has many
methods that allow manipulation of the objects in
the set.  For example:

```html
<!doctype html>
<html>
	<head>
		<title>jQuery-wrapped set example</title>
	</head>
	<body>
		<p id="firstparagraph">first paragraph</p>
		<p class="second">Second paragraph</p>
		<p>There is a <a href="http://bing.com">link</a> in this p element</p>
		<p>There is a <a href="http://yahoo.com">link</a> in this p element</p>
		<p data-hide-me>Code will hide this</p>
		<p data-move-me>Code will make this move</p>
		<script src="http://code.jquery.com/jquery-2.1.4.js"></script>
		<script>
			$(function() {
				$('#firstparagraph').html("The first paragraph");
				$('.second').css('background-color', 'gainsboro');
				$('p>a').attr('href', 'http://www.google.com');
				$('p[data-hide-me]').hide();
				$('p[data-move-me]').animate({ fontSize: '12em' }, 15000);
			});
		</script>
	</body>
</html>
```

jQuery also eases dealing with events.  The 
`on` method can be called on a jQuery-wrapped set,
passing in the type of event to listen for, then an 
anonymous function wrapping the code to be executed
when the event occurs:

```html
<!doctype html>
<html>
	<head>
		<title>jQuery event example</title>
		<style>
			body { padding: 1em; }
			p {
				display: none;
				padding: 1.2em;
				border: 2px solid black;
			}
			p#one { background-color: gainsboro; }
			p#two { background-color: lightblue; }
			p#three {background-color: yellow; }
			a {
				cursor: pointer;
				padding: 0.5em 1em;
				margin: 1em;
				background-color: yellowgreen;
				border: 3px solid darkgreen;
			}
		</style>
	</head>
	<body>
		<a data-content="#one">Show One</a>
		<a data-content="#two">Show Two</a>
		<a data-content="#three">Show Three</a>
		<p id="one">This is the content of para 1</p>
		<p id="two">And here be the content of para TWO</p>
		<p id="three">Lorem ipsum dolor sit THREE</p>
		<script src="http://code.jquery.com/jquery-2.1.4.js"></script>
		<script>
			$(function() {
                $('a').on('click', function() {
                    var target = $(this).attr('data-content');
                    $('p').hide();
                    $(target).show();
                });
			});
		</script>
	</body>
</html>
```