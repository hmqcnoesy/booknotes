#Custom SharePoint Solutions with HTML and JavaScript

Open a site in SharePoint Designer to edit the 
master page for the site.  In the "Master Pages"
section, select `seattle.master` and click "Edit
File".  The file can be edited directly, for 
instance, just before the closing `</head>`:

```html
<script src="//code.jquery.com/jquery-2.14.0.min.js"></script>
```

It would be safer to make a copy of `seattle.master`
and make changes to it so a SharePoint update
doesn't wipe out the custom bits.

The process above doesn't work with publishing
sites, which might require a little more tinkering.

To use the SharePoint JavaScript object model,
include a reference to this:

```html
<script type="text/javascript" src="/_layouts/15/sp.js"></script>
```

With that file referenced, JSOM can be used:

```javascript
$(function() {
	var ctx = new SP.ClientContext();
	var list = ctx.get_web().get_lists().getByTitle('Demo List');
	var caml = new SP.CamlQuery();
	var items = list.getItems(caml);
	ctx.load(items);
	ctx.executeQueryAsync(
		Function.createDelegate(this, this.onQuerySucceeded),
		Function.createDelegate(this, this.onQueryFailed)
	);
});
```

A simpler method is to use the REST API:

```
http://server/site/_api/web/lists/GetByTitle('Demo List')/items
```

Custom HTML, CSS, and JavaScript can be deployed to a 
specific Document Library for just that purpose.  When
doing this, turn off search indexing on the library
(go to settings on the Document Library, click "Advanced
Settings" and find "Allow items to appear in search results").
Optionally then turn on versioning for the Document Library
if rolling back code is required.  Finally, apply unique 
permissions to the library so that only developers can
make changes, but everyone has read access.  Then organize
the Document Library as needed into appropriate folders.

Content Editor Web Parts (CEWP) can be set to use an 
external HTML file instead of containing the markup.
When editing the CEWP, find the "Content Link" and input the URL.
This is the preferred method so that HTML can be developed
outside of SharePoint, and SharePoint doesn't mess with
the markup.  Also, the CEWP can have text specified that
will be displayed to the user in the event that the HTML
from the remote URL cannot be loaded.


##Working with SharePoint's built-in JavaScript functions and properties

###_spBodyOnLoadFunctions

This is an array of functions to be executed when the
page loads.  Push functions onto the array to have them
executed at the right time.  Important replacement for
`$(function() { ... });` when writing jQuery-free.

###_spPageContextInfo

This object contains properties that can help during
development.  For instance:

| Property               | Description  |
| ---------------------- |---------------|
| `siteAbsoluteUrl`      | Full URL of site *collection*   |
| `siteServerRelativeUrl`| Relative URL of site *collection* beginning with `/` |
| `webAbsoluteUrl`       | Full URL of site       |
| `webServerRelativeUrl` | Relative URL of site beginning with `/` |


###SP.UI.Notify

This object provides ways to notify the user:

```javascript
// shown for 6 seconds?
SP.UI.Notify.showLoadingNotification();

// shown for 6 seconds
SP.UI.Notify.addNotification('Custom message');

// shown until user dismisses
var msgId = SP.UI.Notify.addNotification('Custom message', true);

// or until removed in code
SP.UI.Notify.removeNotification(msgId);
```


##8