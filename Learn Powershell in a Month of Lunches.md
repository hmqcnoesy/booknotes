# Learn Windows Powershell in a Month of Lunches

##Chapter 2
`Dir`, `ls`, etc. are aliases to powershell cmdlets (`get-childitem` in the case of those two specifically).

For that reason, some switches don't work like they do in cmd.exe.  For instance, `dir /s` will not work in powershell (and dash is always the param delimiter in powershell, never a slash).

##Chapter 3
`help` and `man` are functions (not aliases) which are wrappers around the get-help cmdlet, to automatically pipe the `get-help` output to `more`
`Get-help` (or `help`) has a `-name` positional parameter for the name of the entry to get help with, which accepts wildcards, so `help *log*` works the way you would expect.  The output is a list of matching help topics, or the help entry if there is only one match.

Typing a complete name without wildcards outputs the help for that particular entry.  So `help get-eventlog` prints the help entry for that cmdlet

Remember `get-help` uses help entries, not cmdlets
Help entries for cmdlets show syntax (parameters names / positions).  Square brackets indicate "optional" for parameter names and values.  Optional parameter names mean a positional paramters, optional values mean just that.

Using `-full` flag with `get-help` can show more information

Parameters shown in cmdlet help entries specify the parameter type: usually strings, also Int and DateTime.  A string array parameter can be `x,y,z` or `'x','y','z'`

##Chapter 4
The `>` character is simply shorthand for ` |out-file`. So `get-process > proc.txt` is running `get-process | out-file proc.txt`

The `out-gridview` cmdlet is maybe a little neat.

The `convertto-html` cmdlet might be handy for something.  For instance, `get-process | convertto-html > processes.html`

##Chapter 5
Not very interesting

##Chapter 6
`Get-member` (or `gm` alias) shows the type and members of that type of whatever is piped into it.  For instance 
`get-process | gm` will output info about the system.diagnostics.process type.

`Sort-object` allows sorting by a property, e.g. `get-process | sort-object -property VM [-desc]`

`Select-object` does a projection of specified properties of the objects piped to it: `get-process | select-object -property Name,ID,VM,PM`

The output of `select-object` is PSObject, which is like an anonymous type, containing properties specified by your projection.

##Chapter 7
Notice that `help stop-service` shows 3 parameter sets - the third has an `-InputObject` parameter of type 
ServiceController, this is how piplining works and why `get-service -name "BITS" | stop-service` works the way one would expect and `stop-service -name "BITS"` also works.

The `-full` help for a cmdlet indicates pipeline capability of a parameter with the property "Accept pipeline input?"

The ByValue property displayed for a param in the help indicates that objects of the exact type are accepted as piped input.  The ByPropertyName indicates that if objects are piped as input and those objects have a matching property name, the values of that property name can be used for the piped input.  ByPropertyName occurs only if piped input doesn't match a ByValue parameter.

The `select-object` cmdlet can be combined with the ByPropertyName functionality with limitless flexibility.

##Chapter 8
There are lots of ways to format output of cmdlets

##Chapter 9
Some cmdlets have their own filtering capabilities using something like `-filter` or something relatively rudimentary like `-name` (e.g. `Get-Service -name "BITS"`)

If you need morebetter filtering capabilities, the `where-object` cmdlet can be piped to. 
`Where-object` uses powershell comparison flags (not strictly operators) such as `-eq`, `-ne`, `-gt`, `-lt`, `-ge`, `-le`, `-ceq`...(the "c" flags are for case sensitive string comparisons)

Boolean flags are used like `(5 -gt 10) -or (10 -gt 1)`

The `-like` comparison can use `*` as a wildcard, as in `"hello" -like "*ll"`

The `-match` comparison can use regex as in `"^[Hh]" -match "hello"`.  There is also `-notmatch` and `-cmatch` and `-cnotmatch`

Example of `where-object`:  
```powershell
get-service | where { $_.Status -eq 'Running' }
```

##Chapter 10 
Remoting is similar to telnet, but commands are submitted over HTTP (port 5985) or HTTPS (5986) and results are sent in HTTP responses.  The protocol is called Web Services for management WS-MAN

The remote server or PC must have the Windows Remote Management service running.

Remoting might have to be enabled on the remote host either through GPO or by running enable-psremoting

Dns aliases might not work, IP addresses might not work.  Use the actual hostname.

By default only Admistrator users can remote PS sessions.

To start a remote session:  `enter-pssession -computerName Blahblahblah`

And to end the remote session: `exit-pssession`

One to many remote commands can be issued like:  
```powershell
invoke-command -computerName server1,server2,server3,server4 -command {...}
```

##Chapter 11
WMI not interesting

##Chapter 12
Async commands can be submitted using `start-job -scriptblock {...}` where the command is in the `{...}`

Async commands are fire and forget and keep the shell available for continued interaction.

Use `get-job` to see a list of running async jobs

To see the output of a completed or failed job, use `receive-job -id #` where `#` is the id of the job, as reported by the `get-job` cmdlet.  You can also use `-name` instead of `-id`.

You can manage jobs using `remove-job`, `stop-job`, and `wait-job`

##Chapter 13
Manual object enumeration can be done using `foreach-object -Process {$_ ... }` where `$_` is the variable referring to the current object, each time through the iteration.

More succinctly, use `% { $_ ... }` in place of the `foreach-object` construct.

##Chapter 14
By default a windows installation has powershell's execution policy set to restricted so scripts cannot be run, although interactive shell sessions work fine.  This is to prevent an unsuspecting user from being tricked into running a malicious script.  `Set-ExecutionPolicy remotesigned` will allow local scripts to run without signing, but remote scripts would have to be signed.  This is the recommended setting from MS for "normal" scripting security.

Scripts can be run from current directory only using `.\scriptname.ps1`.  The command `scriptname.ps1` doesn't execute, purposely, for security reasons.

##Chapter 15
Variables start with `$` but that isn't strictly part of the variable name.  The `$` indicates you are accessing the contents of the variable.

All variables are untyped

Variables do no persist between sessions

Variables are evaluated within double-quoted strings, but not single-quoted ones.  So 
```powershell
$x = 'world'
$y = 'hello $x'
$y
```
will print `hello $x`, but if the second statement were `$y = "hello $x"` it would print `hello world`.  This replacement occurs when the string is initially set, so setting `$y = "hello $x"` actually sets `y` to `"hello world"`.  The `$x` isn't evaluated later on, just the one time when the string is set.  To escape the `$` in a double quoted string use the backtick character.  To get the string `$` evaulation to work in single quoted strings surround the variable with backticks, ie `$y = 'hello ``$x``'`  The backtick also works as an escape for special chars like ` ``n ``t ``a `.

To create a collection in a variable, use commas:  `$list = 'o','p','q'`

Refer to items in a collection using [] notation, 0-based:  `$list[0]` is `'o'`

Negative indices start at the end of the collection, -1-based: `$list[-1]` is `'q'`

Collection variables have a `.count` property to indicate the size of the collection:  `$list.count`

The variable type stored also has its properties and method accessible, `$list[-3].toupper()`

A variable can be typed if needed, by preceeding its first use with the type in brackets:  `[int]$z = read-host "Enter a number"`

##Chapter 16
`Read-Host` reads from the shell, prompting the user inline.

`Write-Host` writes to the shell directly, skipping the usual implicit `Out-Default` and `Out-Host` cmdlets

Other writing cmdlets don't skip the `out-` cmdlets in the pipline, but can modify formatting:  `write-output`, `write-warning`, `write-verbose`, `write-debug`, `write-error`.

##Chapter 17
Create a .ps1 script that accepts parameters by including a `param()` block at the beginning and put variable declarations inside, e.g. 
```powershell
param (
	$computername = 'localhost' 
)
```
Variables declared in this way are all named and positional.  This script could be run using `.\scriptname.ps1 'remoteservername'` or `.\scriptname -computername 'remoteservername'`.

Scripts have their own scope, within the shell's global scope.  Functions have their own scopes also, and a scope is around only as long as required. Variables are hidden when a script or function scope uses the same variable name as a parent scope uses.

##Chapter 18
Store remote sessions in variables for easier remote administration

##Chapter 19
A function wraps up scripted content for reusability.  Same format as a script, including the `param()` section, but wrap the content in function `Verb-Noun {...}`

##Chapter 20
Basic `if` construct looks like
```powershell
if ($var -eq 1) {
    ...
} elseif ($var -eq 0) { 
    ...
} else { 
    ...
}
```

The reserved variables `$True` and `$False` can be used for comparisons and assignments.

The switch construct looks like 
```powershell
switch ($var.status) {
	1001 { 
		...
	} 
	1842 { 
		...
	} 
	'OK' { 
		... 
	} 
	Default { 
		...
	} 
}
```

The types compared can vary.  When comparing for strings, wildcards can be used if the `-wildcard` flag is set between `Switch` and the evaluation expression:  
```powershell
Switch -wildcard ($x)
```

With wildcards, there is the possibility of more than one match.  With a `Break` statement in a block, the switch construct is exited.  Without the break, the next expression is evaluated in turn for a match, so multiple blocks in the switch can be executed.

A for loop looks like:  
```powershell
For ($i = 0; $i -lt 10; i++) { 
	...
}
```

A foreach loop looks like:  
```powershell
Foreach ($cheese in $collection) { 
	...
}
```

which is different than the `ForEach-Object` cmdlet which requires the `$_` syntax.

##Chapter 21
Turn your scripts into cmdlets

##Chapter 22
A built-in variable, `$ErrorActionPreference` determines shell behavior when encountering an error.  The possible values are SilentlyContinue, Continue, Inquire, Stop.  The default is Continue.  To set the value, just set the variable to the appropriate string.  

The `$ErrorActionPreference` variable is a shotgun approach, but each cmdlet in powershell has an `-ea` or `-erroraction` parameter that determines behavior when running just that cmdlet.  The parameter value is the same strings as are available for the global variable.

The try/catch construct looks like: 
```powershell
Try { 
	...
} Catch { 
	...
} Finally { 
	...
}
```
Within the Catch block, the `$error` variable points to a collection of errors caught, and `$error[0]` will be the most recent.  The catch and finally blocks are optional, so long as at least one of them is included.  Another way to handle is to use the `-ev` or `-ErrorVariable` parameter for a cmdlet and specify the name of a variable to store an error if one is encountered (variable name without the $):  
```powershell
Try { 
	Try-SomethingRisky -ea Stop -ev MyError 
} Catch { 
	write-output $MyError 
}
```

##Chapter 23
Breakpoints can be set in the ISE.  `Set-psbreakpoint` cmdlet also allows for interactive script debugging, but it's not as powerful or easy to use as the ISE.

##Chapter 24
A profile script contains commands you want executed at startup of your shell session.  A simple profile script might contain just `cd c:\users\myusername`

Profile scripts are loaded from the following locations in this order: 
1. $pshome/profile.ps1 (all consoles)
2. $pshome/Microsoft.PowerShell_profile.ps1 (ISE only)
3. $home/documents/WindowsPowerShell/profile.ps1 (all consoles)
4. $home/documents/WindowsPowerShell/Microsoft.PowerShellISE_profile.ps1 (ISE only)

On 64-bit systems there are 2 versions of the console and ISE
$pshome is a built-in variable, most systems set to c:\windows\system32\windowspowershell\v1.0
$home is also built-in, usually c:\users\currentuser

The third location above is usually the best, since it will be loaded just for your user account, and it will be loaded in the regular console and the ISE
A profile script is just like any other script, and is subject to the execution policy on the system.

The replace operator is used like:  
```powershell
"192.168.34.12" -replace "34", "15"
```

The join operator:  
```powershell
$arr = 'a','b','c','d','e'
$arr -join "|";
```

The split operator: 
```powershell
$arr = (gc tabdelimitedfile.txt) | -split "`t"
$arr[3]
```

All .net string methods are also available, like 
```powershell
"  abqdefg  ".trim().replace("q","c")
```

Same with dates.  Use the cmdlet `get-date` for current.  `(get-date).month`

