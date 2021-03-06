#Visual Studio Code

Use `code .` to open the current folder.  The
`-r` flag opens the file in the last active
instance of the Code application, and `-n`
forces a new instance of Code to be opened.

Use <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>P</kbd>
to open the command palette,
which reveals all of Code's features.  The
<kbd>Ctrl</kbd><kbd>P</kbd> command allows you to 
search for a 
file and open it, like <kbd>Ctrl</kbd><kbd>,</kbd> 
in Visual Studio. <kbd>Ctrl</kbd><kbd>P</kbd> then 
</kbd>></kbd> is equivalent 
to <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>P</kbd>.
<kbd>Ctrl</kbd><kbd>P</kbd> then </kbd>?</kbd> 
shows help 
available and can guide you to commands you need.

Use <kbd>Ctrl</kbd><kbd>1</kbd>, 
<kbd>Ctrl</kbd><kbd>2</kbd>, <kbd>Ctrl</kbd><kbd>3</kbd>
to move into or open additional side by side windows, up to
a total of three across. 

Use <kbd>Ctrl</kbd><kbd>D</kbd> to progressively 
multi-select text matching
the currently selected text.  For instance, in a
code file, select a variable name, then 
<kbd>Ctrl</kbd><kbd>D</kbd> will 
find and highlight the next instance of it.  
<kbd>Ctrl</kbd><kbd>D</kbd>
again will find a third instance, and so on.  Each time,
the found text becomes selected in multi-selector.
To accomplish the same process for all instances of
selected text in a document without having to progressively
select each found instance:  with the text selected,
use <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>L</kbd>.
<kbd>Alt</kbd><kbd>Click</kbd> allows mouse-driven
multi-selection anywhere.  To make a vertical multi-
selection (like Visual Studio's 
<kbd>Shift</kbd><kbd>Alt</kbd><kbd>DownArrow</kbd>)
use <kbd>Ctrl</kbd><kbd>Alt-Arrow</kbd>.

Intellisense is available using <kbd>Ctrl</kbd>
<kbd>Space</kbd>.  The
intellisense is file-type-aware.  For instance,
in a markdown file, the intellisense shows options
for `img`, `code`, etc. 

Create user snippets using the File > Preferences menu.
A snippet requires a prefix and a body, which is an
array of strings representing each line to be inserted
when the snippet is invoked:

```json
"html" : {
    "prefix": "html",
    "body": [
        "<!doctype html>",
        "<html>",
        "<head>",
        "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=Edge\" />",
        "    <meta name=\"viewport\" content=\"width=device-width\" />",
        "    <link rel=\"icon\" href=\"data:;base64,iVBORw0KGgo=\">",
        "    <title>${title}</title>",
        "</head>",
        "<body>",
        "    ${body}",
        "</body>",
        "</html>"
    ]	
}
```

To move current line or multiple selected lines up or
down a row, use <kbd>Alt</kbd><kbd>Arrow</kbd>.
To copy the current line or multiple selected lines
use <kbd>Alt</kbd><kbd>Shift</kbd><kbd>Arrow</kbd>.


[Emmet](http://docs.emmet.io) is used for zen coding.  For example,
`div.container>ul>li*5` followed by <kbd>Tab</kbd>
becomes:  

```html

<div class="container">
    <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>
</div>
```

User settings in Code are applied for the entire installation.
Workspace settings, if specified, will create a .settings
folder in the current working folder, with a settings.json
file within.  The settings specified in settings.json apply
to that folder only, which is handy for per-project settings
to be checked into source control.

JSON schema information is supported with the 
`json.schemas` property in the settings.

JavaScript intellisense is supported by TypeScript
definitions via DefinitelyTyped.  If not installed yet,
get the TypeScript Definition Manager:

```
npm i -g tsd
```

Then initialize tsd in the project folder:

```
tsd init
```

And use it to retrieve desired definitions:

```
tsd query jquery --action install
```

The above command will look for jquery and install
its type definition file in the project's "typings"
subfolder, where Code looks for type info.  By 
default, tsd queries Boris Yankov's 
[DefinitelyTyped](https://github.com/borisyankov/DefinitelyTyped/)
repository.

