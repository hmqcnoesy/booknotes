#Pro SharePoint with jQuery

##Making jQuery available on a SharePoint page

###Content editor web part (CEWP)

In a web part page, add a CEWP, then edit
the HTML source and add a reference to jQuery,
whether it's from a CDN, a global SharePoint
copy, or a copy kept in a document library.

```html
<script type="text/javascript" src="//code.jquery.com/jquery-2.1.4.min.js"></script>
<script type="text/javascript">
	$(function() { alert('jquery is loaded'); });
</script>
```

Script elements can also be added to ***custom*** 
master pages.  Simply open the master page for
editing and in the head add either the normal 
`<script>` element, or the SharePointy version:

```html
<SharePoint:ScriptLink 
	language="javascript" 
	name="//code.jquery.com/jquery-2.1.4.min.js" 
	Defer="false" 
	runat="server" />
```


##Viewing SharePoint data using jQuery

Use the SharePoint web services to 
retrieve list data:

```javascript
$.ajax({
	type: 'GET',
	url: '/_vti_bin/ListData.svc/ListName',
	dataType: 'json',
	success: function(data) {
		$.each(data.d.results, function(i, result) {
			alert(result.Id + result.Title);
		});	
	}
});
```

Or more succinctly, the `$.getJSON()` can be
used where a URL and success callback are
passed in.  The success callback function
takes a parameter representing the returned
data:

```javascript
$.getJSON(url, function(data) {
	// data is object parsed from http response JSON
});
```


##6
