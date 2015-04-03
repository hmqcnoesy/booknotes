#Professional ASP.NET MVC 5

##Chapter 3 Views
The `ViewDataDictionary` is the only way to get data
from the controller into the view.  It is responsible
for `ViewData` and `ViewBag` items, as well as the 
`Model` item of a strongly typed view.  


The difference between `View()` and `PartialView()`
methods in a controller is that `PartialView()` skips
`_ViewStart.cshtml`.

##Chapter 5 Forms and HTML Helpers

When an Html helper method is given a string as a 
property name for rendering a control, the model object
is used first, but `ViewBag` properties are searched as 
well:

```c#
ViewBag.Price = 1.00m;
ViewBag.Album = new  Album { Price = 1.20 };
```

With this in the view:

```razor
@Html.TextBox("Price")
@Html.TextBox("Album.Price")
```

Produces this:

```html
<input type="text" name="Price" value="1.00" id="Price" />
<input type="text" name="Album.Price" value="1.20" id="Album_Price" />
```

##Chapter 9 Routing
Attribute routing can be applied at the controller
level.  And multiple routes can be simultaneously
applied.  Attributes applied at the action level 
then override controller routes:

```csharp
[Route("home")]
[Route("")]
[Route("home/index")]
public class HomeController : Controller 
{
    [Route("nothome/specialaction/{id}")]
    public ActionResult SpecialAction(string id) {
        ...
    }
}
```

Route prefixes are available, although probably stupid:

```csharp
[RoutePrefix("home")]
[Route("{action}")]
public class HomeController : Controller 
{
    ...
}
```

Constraints are easy to apply:

```csharp
[Route("person/{id:int}")]
public ActionResult PersonDetails(int id) 
{
    ...
}

[Route("person/{name}")]
publicActionResult PersonDetails(string name) 
{
    ...
}
```

The following inline constraints are available:

* `{x:bool}`
* `{x:datetime}`
* `{x:decimal}`
* `{x:double}`
* `{x:int}`
* `{x:long}`
* `{x:minlength(4)}`
* `{x:maxlength(9)}`
* `{x:length(5,6)} //between 5 and 6 chars`
* `{x:min(11)} // int64 greater than or equal 11`
* `{x:max(7)}`
* `{x:range(100, 999)} // Int64 inclusive range`
* `{x:bool}`
* `{x:regex(^[A-Z]{4}$)}`

Default route parameters are specified like this:

```csharp
[Route("home/{action=index}")]
```

And optional route parameters are specified:

```csharp
[Route("home/{action}/{id?}")]
```

