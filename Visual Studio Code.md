#Visual Studio Code

Use `code .` to open the current folder.  The
`-r` flag opens the file in the last active
instance of the Code application, and `-n`
forces a new instance of Code to be opened.

Use <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
to open the command palette,
which reveals all of Code's features.  The
`Ctrl-P` command allows you to search for a 
file and open it, like `Ctrl-,` in Visual Studio.
`Ctrl-P` then `>` is equivalent to `Ctrl-Shift-P`.
`Ctrl-P` then `?` shows help available and can
guide you to commands you need.

Use `Ctrl-1`, `Ctrl-2`, `Ctrl-3`, to move into
or open additional side by side windows, up to
a total of three across. 

Use `Ctrl+D` to progressively multi-select text matching
the currently selected text.  For instance, in a
code file, select a variable name, then `Ctrl+D` will 
find and highlight the next instance of it.  `Ctrl-D`
again will find a third instance, and so on.  Each time,
the found text becomes selected in multi-selector.
To accomplish the same process for all instances of
selected text in a document without having to progressively
select each found instance:  with the text selected,
use `Ctrl-Shift-L`.  `Alt+Click` allows mouse-driven
multi-selection anywhere.  To make a vertical multi-
selection (like Visual Studio's `Shift-Alt-DownArrow`)
use `Ctrl-Alt-Arrow`.

Intellisense is available using `Ctrl+Space`.  The
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
down a row, use `Alt+Arrow`.

