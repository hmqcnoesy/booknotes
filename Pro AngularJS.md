#Pro AngularJS

##First AngularJS App

AngularJS apps are made up of one or
more modules.  The `angular.module()`
method creates a module.  
The first arg to the module method
is the name of the module, by which
it will be referenced in the HTML.
The second arg is an array of 
dependencies and must be included even
if there are no dependencies (empty 
array).  The name of the app module
is included in the HTML using the 
non-standard attribute `ng-app`, which
can be applied at whatever level in the
DOM is necessary to allow angular to
parse and modify descendant elements.

`ng-app` is an example of an angular
directive, which can be elements, 
attributes, or classes that "extend"
standard HTML.

An angular controller defines the 
logic required to support a view, 
connecting it to the model.  It responds
to user interaction, updating the model
as necessary and providing the view
with the data it requires.  A
controller is created using the 
`controller()` method, passing in
the name of the controller as the first
argument, and as the second argument 
a function to be invoked by angular, 
defining the controller functionality.
This function can itself take arguments
which are provided by angular.  For
example, `$scope` can be supplied to
the controller function.  `$scope` is
used to provide data and functionality
to a view.  The portion of HTML to which
a controller applies is assigned 
using the `ng-controller` attribute
directive, setting the value to the
name of the controller.

Displaying data in the view (provided
by the controller) can be done in 
a number of ways.  One-way binding from
the model to the view can be done using
the `{{ propName }}` syntax, or can
be done using the `ng-bind` attribute
directive, which sets the element's
`innerHTML` to the binding expression's
evaluated value.  
Two-way binding between
the model and the view can be applied
to editable elements in the HTML
using the `ng-model` attribute 
directive, which sets the `value` 
attribute of the element to the 
binding expression's evaluated value.

In addition to data, behaviors can
be defined on the `$scope` object within a
controller by setting a property
equal to a function that defines the
behavior.  The function is executed
automatically at the appropriate times
by angular.

Here is an example putting together
all of the pieces described above:

```html
<!doctype html>
<html>
<head>
	<style>
		.warning { background-color: lightsalmon; }
		.ok { background-color: lightgreen; }
	</style>
	<script src="angular.js"></script>
	<script>
		var app = angular.module('todoApp', []);
		app.controller('todoCtrl', function($scope) {
			$scope.todos = [
				{id: 1, title: 'Call someone', complete: false },
				{id: 2, title: 'Buy something',complete: true },
				{id: 3, title: 'Go somewhere', complete: false }
			];
			
			$scope.countIncomplete = function() {
				var count = 0;
				$scope.todos.forEach(function(element) {
					if (!element.complete) count++;
				});
				return count;
			};
			$scope.warningLevel = function() {
				return $scope.countIncomplete() == 0 ? 'ok' : 'warning';
			};
			$scope.addTodo = function() {
				$scope.todos.push({
					id: $scope.todos.length+1,
					title: $scope.newItem.title,
					complete: $scope.newItem.complete
				});
			};
		});
	</script>
</head>
<body ng-app="todoApp">
	<div ng-controller="todoCtrl">
		<p ng-class="warningLevel()">
			There are {{ todos.length }}
			todos in this list.
		</p>
		<p ng-hide="countIncomplete() == 0">
			{{ countIncomplete() }}
			of the items are incomplete.
		</p>
		<p ng-show="countIncomplete() == 0">
			Everything is done!
		</p>
		<table>
			<tr ng-repeat="todo in todos">
				<td>
					{{ todo.id }}
				</td>
				<td ng-bind="todo.title"></td>
				<td>
					<input type="checkbox" ng-model="todo.complete" />
				</td>
				<td>
					{{ todo.complete }}
				</td>
			</tr>
			<tr>
				<td>
					<button type="button" ng-click="addTodo()">Add item</button>
				</td>
				<td>
					<input type="text" ng-model="newItem.title" />
				</td>
				<td>
					<input type="checkbox" ng-model="newItem.complete" />
				</td>
			</tr>
		</table>
	</div>
</body>
</html>
```

Filtering can be added to binding 
expressions to do alter content.
For instance:

```html
<tr ng-repeat="item in todos | filter: {complete: false} | orderBy: 'title'">
```

The above expression uses the filter
filter and the orderBy filter to 
adjust the items displayed.  Custom
filters can be added to an angular 
module using the `filter()` method.
The filter method takes two arguments:
the first is the name of the filter 
(used in the binding expression), and
the second is a function that must
return a function which must return 
the filtered data.  For instance:

```javascript
app.filter('checkedItems', function() {
	return function(items, showComplete) {
		var result = [];
		items.forEach(function(item) {
			if (item.complete == false || showComplete === true) {
				result.push(item);
			}
		});
		return result;
	};
});
```

The above example could be used like:

```html
<tr ng-repeat="todo in todos | checkedItems:showComplete | orderBy:'action'">
...
<p>
	<label>Show complete</label>
	<input type="checkbox" ng-model="showComplete" />
</p>
```

Getting data over HTTP instead of 
the above example's static data 
definition in code is straightforward:
angular provides an `$http` service
to make ajax requests.  Assuming a
JSON file named data.json located
at the same path as the above 
HTML file with these contents:

```javascript
[
{"id": 1, "title": "Call someone", "complete": false },
{"id": 2, "title": "Buy something","complete": true },
{"id": 3, "title": "Go somewhere", "complete": false },
]
```

The code could be changed to something
like:

```javascript
app.controller('todoCtrl', function($scope, $http) {
	$scope.todos = [];
	$http.get('data.json').success(function(data) {
		$scope.todos = data;
	});
	
	//remaining functionality same as before
});
```

In the code above, it was necessary
to set the `$scope.todos` to an empty
array because of the async nature of
the ajax request.  Without that set,
`$scope.todos` would be undefined as
the code executes past the `$http.get`
call, and causes errors in execution.

The `$http.get()` call returns a 
promise object which exposes a 
`success()` method that runs if and
when the ajax operation completes
successfully.


##Putting AngularJS in Context

AngularJS extends standard HTML by
adding its own attributes, elements,
classes, and comments.  An application
using AngularJS will end up having
a mixture of standard and custom
"angular-extended" HTML.

##JavaScript Primer

`angular.extend()` allows extension of
an object:

```javascript
var obj = {
	id: 12345,
	name: 'something'
};

var extObj = {
	description: 'some description'
};

angular.extend(extObj, obj);

console.dir(extObj);
```

The `angular.forEach()` function 
can loop through elements of an
array, or it can loop through
properties of an object:

```javascript

var obj = {
	id: 12345,
	name: 'some name',
	description: 'some desc'
};

angular.forEach(obj, function(value, key) {
	console.log(key, value);
});
```

To check if an object has
a property, use the `in`
operator:

```javascript

var obj = {
	id: 12345,
	name: 'some name',
	description: 'some desc'
};

console.log('name' in obj);     //true
console.log('missing' in obj);  //false
```

The `angular.equals()` method 
will compare two arguments using
the `===` operator, or if both
arguments are objects, it will 
return true if all properties
pass the identity comparison:

```javascript

var obj = {
	id: 12345,
	name: 'some name',
	description: 'some desc'
};

var other = {};

angular.extend(other, obj);
console.log(angular.equals(obj, other)); // true

other.name = 'another name';
console.log(angular.equals(obj, other)); // false

other.name = obj.name;
console.log(angular.equals(obj, other)); // true

other.extraProperty = 'extra';
console.log(angular.equals(obj, other)); // false

delete other.extraProperty;
console.log(angular.equals(obj, other)); // true
```

To convert strings to numbers,
use built-in functions like
`Number(str)`, `parseInt(str)`,
and `parseFloat(str)`.

AngularJS can help detect a 
JavaScript array with the 
`isArray()` method:

```javascript
var obj = {};
var arr = [];

console.log(angular.isArray(obj)); // false
console.log(angular.isArray(arr)); // true
```

The AngularJS `forEach()` 
method enumerates the elements
of an array:

```javascript
var arr = [1,2,3,44,56,72];
angular.forEach(arr, function(value, key) {
	console.log(key, value);  // the keys are indexes
});
```

The AngularJS function `isDefined()`
helps determine if a property has 
been defined:

```javascript
var obj = {
	name: 'some name',
	desc: 'some desc'
};

console.log(angular.isDefined(obj.desc));  // true
console.log(angular.isDefined(obj.id)); // false
```

