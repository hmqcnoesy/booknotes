#SharePoint 2013 Fundamentals

##Site Pages
Each SharePoint 2013 site by default has a Site Pages 
document library.  You can open this document library
in windows explorer and add .aspx pages.  Here is an 
example custom .aspx page.  (In line C# or VB is not 
allowed in site pages)

```asp
<%@Page 
	Inherits="System.Web.UI.Page"
	MasterPageFile="~masterurl/default.master" %>
	
<asp:Content 
	ID="Main" 
	ContentPlaceHolderID="PlaceHolderMain" 
	runat="server">
	<div>Hello Main</div>
</asp:Content>
	
<asp:Content 
	ID="PageTitle" 
	ContentPlaceHolderID="PlaceHolderPageTitle" 
	runat="server">
	Hello Title
</asp:Content>
	
<asp:Content 
	ID="PageTitleInTitleArea" 
	ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" 
	runat="server">
	
	<div>Hello Title Area</div>
</asp:Content>

```

##Server Object Model
Code that is executed in the context of SharePoint, 
running in the same asp.net app pool.  API is 
implemented in Microsoft.SharePoint.dll.  The core
types are SPSite, SPWeb, SPList, SPListItem, etc.

```csharp
using(var site = new SPSite("http://localhost/sites/demo")) 
{
	var web = site.RootWeb;
	ListBox1.Items.Add(web.Title);
	
	foreach(SPList list in web.Lists) 
	{
		if (!list.Hidden) ListBox1.Items.Add("\t" + list.Title);
		
		foreach(SPListItem item in list) 
		{
			// notice that Title is strongly typed property, other columns not so much
			var title = item.Title;
			var unitPrice = (decimal)item["Unit_x0020_Price"];
			ListBox2.Items.Add(string.Format("{0} ({1})", title, unitPrice);
		}
	}
}
```

##Client(-Side) Object Model (CSOM)
Three main js files used in JavaScript apps

* `/_layouts/15/SP.js`
* `/_layouts/15/SP.Runtime.js`
* `/_layouts/15/SP.Core.js`

In an HTML file you might want something like:

```html
<body>
	<button id="btn">Click to load</button>
	
	<div id="div">Nothing</div>
	
	<script src="//code.jquery.com/jquery.min.js"></script>
	<script src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
	<script src="/_layouts/15/sp.runtime.js"></script>
	<script src="/_layouts/15/sp.js"></script>
	<script src="app.js"></script>
</body>
```

Where the `app.js` file is your custom JavaScript for 
the page.  The MicrosoftAjax.js file is required 
because you don't have a ScriptManager control on the
page to provide it automatically, and it is a dependency
of the sp.*.js files.

The `app.js` file might include something like:

```javascript
$(function() {
	$('#btn').click(function() {
		var ctx = SP.ClientContext.get_current();
		var web = ctx.get_web();
		ctx.load(web);
		ctx.executeQueryAsync(function success() {
				$('#div').html(web.get_title());
			},
			function failure() {
				alert('fail');
			});
	});
});
```

The CSOM object model is bizarre.  Probably best just to 
use the REST API.

##REST API

The URL of the API for a site is `http://<siteurl>/_api/web`
and the api for lists would be `http://<siteurl>/_api/web/lists`
and an individual list can be retrieved using something like
`http://<siteurl>/_api/web/lists/getByTitle('Announcements')` 
and finally a list's items can be retrieved using something like
`http://<siteurl>/_api/web/lists/getByTitle('Announcements')/items`.

The API handles verbs GET, POST, PUT, DELETE.

The operations are based on the OData protocol.

A simple example use of the REST API includes this HTML:

```html
<body>
	<button id="btn">Click to load</button>
	
	<div id="div">Nothing</div>
	
	<script src="//code.jquery.com/jquery.min.js"></script>
	<script src="app.js"></script>
</body>
```

And the contents of app.js:

```javascript
$(function() {
	$('#btn').click(function() {
		var ajaxCall = $.ajax({
			url: '../_api/web/lists/getByTitle(\'Announcements\')/items',
			method: 'GET',
			dataType: 'json',
            headers: { Accept: 'application/json;odata=verbose' }
		});
		
		ajaxCall.done(function(data) {
			var html = '';
			for (var i = 0; i < data.d.results.length; i++) {
				html += '<h2>' + data.d.results[i].Title + '</h2>'
					+ '<div>' + data.d.results[i].Body + '</div>';
			}
			
			$('#div').html(html);
		});
		
		ajaxCall.fail(function(data) {
			alert('f');
		});
	});
});
```

Note that the /_api does not expose metadata, so you
cannot add a service reference in Visual Studio.
Two options for managed code then might be to 
get data in XML and use LINQ to XML, or get the data
back in JSON and use JSON.NET or the 
JavaScriptSerializer to deserialize.

Here is a JSON example:

```csharp
var url = "https://whatever/sites/mysite/_api/web/";
var wc = new WebClient();
wc.UseDefaultCredentials = true;
wc.Headers[HttpRequestHeader.Accept] = "application/json;odata=verbose";

var json = wc.DownloadString(url);
var ser = new JavaScriptSerializer();
dynamic obj = ser.Deserialize<object>(json);
```

