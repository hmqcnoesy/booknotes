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
	
<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
	<div>Hello Main</div>
</asp:Content>
	
<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
	Hello Title
</asp:Content>
	
<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
	<div>Hello Title Area</div>
</asp:Content>

```

##Client(-Side) Object Model (CSOM)
Three main js files used in JavaScript apps

*`/_layouts/15/SP.js`
*`/_layouts/15/SP.Runtime.js`
*SP.Core.js

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
		$.ajax({
			url: '../_api/web/lists/getByTitle(\'Announcements\')/items',
			method: 'GET',
			dataType: 'json',
            headers: { Accept: 'application/json;odata=verbose' },
			success: function(data) {
				var html = '';
				for (var i = 0; i < data.d.results.length; i++) {
					html += '<h6>' + data.d.results[i].Title + '</h6>'
						+ '<div>' + data.d.results[i].Body + '</div>';
				}
				
				$('#div').html(html);
			},
			error: function(data) {
				alert('f');
			}
		});
	});
});
```