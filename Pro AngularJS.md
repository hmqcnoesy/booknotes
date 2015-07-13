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

A promise is a JavaScript object 
encapsulating functionality to be
performed asynchronously at a point
in the future.  An example of a
promise in AngularJS is the object
that is returned (immediately) by
`$http.get()`:

```javascript
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
    var promise = $http.get('data.json');
    promise.success(function(data) {
        $scope.data = data;
    });
    // more code that will execute
    // *before* the function in promise.success
});
```

In addition to the `success(cb)` method,
the promise returned by `$http.get`
also has an `error(cb)` and 
`then(success, err)` method.  The
error is invoked when there is failure
in finishing the work represented by
the promise.  The "then" has two
callbacks, to be invoked upon success
or failure.  Each of the methods returns
a promise object, so the methods can
be chained together, including multiple
invocations of `then()`.  The data object
passed into success funtions is always
a standard JavaScript object, when 
parsed from an HTTP response using a
JSON payload.


##A Real Application

When calling `angular.module()` passing
two parameters (a string and an array), 
a new module object will be returned.

```javascript
var app = angular.module('sportsStore', []);
```

When calling with a single parameter 
(just the string), the previously 
created module of that name wil be 
returned.  (If no matching module has
been created already, an error is
thrown).

```javascript
var app = angular.module('sportsStore');
```

This is how controllers in various files
can get a hold of the application module.
A controller may do something like the 
following:

```javascript
angular.module("sportsStore").controller('sportsStoreCtrl', function($scope) {
	$scope.data = {...};
  };
});
```

Remember that when defining a filter,
you give the filter a name, and the 
second paramter is a function that must
return a function that returns an array
of the filtered data.  Below is an example
of a custom filter that can be reused.
It filters for a unique set of values:

```javascript
var customFiltersModule = angular.module('customFilters', []);

customFiltersModule.filter('unique', function() {
	return function(data, propertyName) {
		if (angular.isArray(data) && angular.isString(propertyName)) {
			var results = [];
			var keys = {};
			
			for (var i = 0; i < data.length; i++) {
				var val = data[i][propertyName];
				
				if (keys[val]) continue;

				keys[val] = true;
				results.push(val);
			}
			return results;
		}
		return data;
	}
});
```

Note that the `data` parameter represents
the data passed into the filter, and is 
required of all filters.  Additional
paramters follow it, and in this case there
is one, representing the name of the property
to be filtered.  To use this custom filter:

```html
<li ng-repeat="cat in data.products | unique:'category' | orderBy:'toString()'">
	<a ng-click="selectCategory(cat)" ng-bind="cat"></a>
</li>
```

Note above that the parameter passed to the
"unique" filter is in quotes (single quotes 
because double-quotes were used to delimit
the value of the ng-repeat attribute).  By
default, AngularJS assumes that expression 
symbols refer to variables in the scope.  
Specifying a static value - a string literal - 
requires the quote characters.  Also note
that the expression can pipe output of one
filter to another, such as the orderBy filter
above.  The orderBy filter expects a property
name to perform ordering of the objects.  
Since the unique filter results in an
array of strings, the above example uses a 
function, `toString()` as the sort expression.

The `ng-click` directive above assigns behavior
to the `a` element when clicked.  The controller
might define the behavior like this:

```javascript
$scope.selectedCategory = null;

$scope.selectCategory = function(category) {
	$scope.selectedCategory = category;
};
```

Items on the page could be shown if the 
scope's `selectedCategory` is null or if 
it matches the item's category:

```html
<li ng-show="selectedCategory == null || item.category == selectedCategory">
	...
</li>
```

To wire this all up correctly, 
the application module would need to 
be updated to declare a dependency on the
custom filter:

```javascript
var app = app.module('sportsStore', ['customFilters']);
```

And finally, a reference to the file 
would need to be made (assuming the 
custom filter was placed in its own file):

```html
<script src="/public/js/filters/customFilters.js"></script>
```

Note that the script reference to the 
custom filter comes *after* the script 
that creates the app module which has a 
dependency on the custom filter.  This 
can seem confusing, but angular loads
all modules before using them to resolve
dependencies.

Create multiple controllers when necessary.
For instance, there might be the page's
main controller:

```javascript
angular.module('sportsStore').controller('sportsStoreCtrl', function($scope) {
	$scope.data.products = {...};
});
```

Then another controller in a separate file
(obviously each file would need its own
script reference):

```javascript
angular.module('sportsStore').controller('productListCtrl', function($scope) {
	$scope.selectedCategory = null;
	$scope.selectCategory = function(category) {
		$scope.selectedCategory = category;
	};
});
```

Then the html might keep the `sportsStoreCtrl`
scope at the `body` but then in an ancestor
element:

```html
<div ng-controller="productListCtrl">
	...
</div>
```

The elements in the div above would have access
to the `$scope` data from *both* controllers.

You can use the `ng-class` attribute to 
assign an element's class to an angular expression:

```html
<a ng-class="getSelectionStyleClass(category)">...</a>
```

Constants can be defined on a per-module basis 
like so:

```javascript
angular.module('sportsStore')
	.constant('productListPageCount', 3)
	.controller('productListCtrl', function($scope) {
		// as before...
	});
```

Adding pagination to display pages of scope 
data could be done in a way like this:

```javascript
angular.module('sportsStore')
	.constant('productListPageCount', 3)
	.controller('productListCtrl', function($scope) {
		$scope.selectedPage = 1;
		$scope.pageSize = productListPageCount;
		
		$scope.selectedCategory = null;
		$scope.selectCategory = function(category) {
			$scope.selectedCategory = category;
			$scope.selectedPage = 1;
		};
		$scope.selectPage = function(pageNumber) {
			$scope.selectedPage = pageNumber;	
		};
		$scope.getSelectionStatus = function(category) {
			if ($scope.selectedCategory == null && category == null) return "selected";
			if ($scope.selectedCategory === category) return "selected";
			return '';
		};
	});
	
// filter code
angular.module('customFilters', [])
	.filter('unique', function() {
		// as before...
	})
	.filter('range', function ($filter) {
		return function (data, page, size) {
			if (!angular.isArray(data) 
				|| !angular.isNumber(page)
				|| !angular.IsNumber(size)) {
			
				return data;	
			}
			
			var startIndex = (page - 1) * size;
			if (data.length < startIndex) return [];
			else return $filter('limitTo')(data.splice(startIndex), size);
		};
	});
```

Then to use the new pagination filter:

```html
<div ng-repeat="product in data.products | range:selectedPage:pageSize">
	...
</div>

<a ng-repeat="page in data.products | pageCount:pageSize" ng-click="selectPage($index + 1)">
	{{ $index + 1 }}
</a>
```


##Chapter 7 Navigation and Checkout

AngularJS provides support for making 
Ajax requests through the `$http` service:

```javascript
angular.module('sportsStore')
	.controller('sportsStoreCtrl', function($scope, $http) {
		$scope = {};
		$http.get('/products')
			.success(function(data) {
				$scope.data.products = data;	
			})
			.error(function(error) {
				$scope.data.error = error;
			});
	});
```

The `$http.get` method immediately returns
an object that has `success` and `error`
methods.  Functions can be passed to those
two methods, to be executed upon success 
or error of the Ajax invocation.

The `ng-include` directive can be used
to bring "partial" html fragments in as
needed:

```html
<ng-include src="'views/productList.html'">
</ng-include>
```

Note the double and single quotes in the 
value of the `src` attribute above.  
Leaving out the single quotes would result
in an angular expression looking for 
properties on the `$scope`.

A less ugly method is to use `ng-include`
as an attribute instead of an element.
The above could be written:

```html
<div ng-include="'views/productList.html'">
</div>
```

An AngularJS service is created using
the `.factory` method, which takes a 
name as a first parameter and a function
to be invoked as a second.  The function
is invoked once only, when creating the
service, but then the singleton service
is available throughout the application:

```javascript
var cartModule = angular.module('cart', []);
cartModule.factory('cart', function() {
	var cartItems = [];
	
	return {
		addProduct: function(id, name, price) {
			var addedToExisting = false;
			cartData.forEach(element) {
				if (element.id == id) {
					element.count++;
					addedToExisting = true;
					break;	
				}
			}
			if (!addedToExisting) {
				cartItems.push({
					count: 1,
					id: id,
					price: price,
					name: name
				});	
			}
		},
		removeProduct: function(id) {
			for (var i = 0; i < cartItems.length; i++) {
				if (cartData[i] == id) {
					cartData.splice(i, 1);	
				}	
			}
		},	
		getProducts: function() {
			return cartItems;	
		}
	};
});
```

Likewise, a custom directive can be added
to a module using the `.directive()`
method, which takes a name parameter and
a factory function that returns a directive
definition object.  That object defines 
properties that tell AngularJS what the 
directive is and how it is used:

```javascript
var cartModule = angular.module('cart');
cartModule.factory('cart', function() {
	// as before...
});

cartModule.directive('cartSummary', function(cart) {
	return {
		restrict: 'E',
		templateUrl: '/public/js/components/cart/cartSummary.html',
		controller: function ($scope) {
			var cartItems = cart.getProducts();
			
			$scope.total = function() {
				var total = 0.0;
				for (var = i; i < cartItems.length; i++) {
					total += (cartItems[i].price * cartItems[i].count);	
				}	
				return total;
			}	
			
			$scope.itemCount = function() {
				vart total = 0;
				for (var i = 0; i < cartItems.length; i++) {
					total += cartItems[i].count;
				}
				return total;
			}
		}	
	};
});
```

The above directive definition defines a 
controller, using a specified view, and 
restricts the use of the directive to 
an element (E).  The `cart` parameter is
declaring a dependency on the cart service,
defined immediately above it in the same
module.

Some example HTML that would use the custom
directive might look like:

```html
<div>
	Cart: <span ng-bind="itemCount()"></span>
	items, <span ng-bind="total() | currency"></span>
</div>
```

The above cart widget would be applied by
modifying the top level module creation to
include a dependency on the cart:

```javascript
var app = angular.module('sportsStore', ['customFilters', 'cart']);
```

And a script reference must be added:

```html
<script src='components/cart/cart.js'></script>
```

And finally, the custom directive in the
HTML where the cart widget is to be displayed:

```html
<cart-summary />
```

URL routing can be done by adding a script 
reference to `angular-route.js` (a separate
download) and then modifying the top level
module creation to configure the routes:

```javascript
var app = angular.module('sportsStore', ['customFilters', 'cart', 'ngRoute']);
app.config(function($routeProvider) {
	$routeProvider.when('/checkout', {
		templateUrl: '/views/checkoutSummary.html'
	});
	
	$routeProvider.when('/products', {
		templateUrl: '/views/productList.html'
	});
	
	$routeProvider.otherwise({
		templateUrl: '/views/productList.html'
	});
});
```

Then in the HTML:

```html
<ng-view />
```