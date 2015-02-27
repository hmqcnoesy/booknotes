# Head First Python
The `python` command in the shell (assuming PATH is set) will open a REPL.
If a .py file is passed as first arg to python, it will execute that file as a script.
Script example (test.py):
```python
import sys
print(sys.platform)
```
    
Then to run that script, `cd` into the directory containing that test.py file and `python test.py`

Notice that the filename as an arg requires the .py extension, but .py is omitted from import statements within scripts.
Importing a module runs the code that is in that script file.  The importing process happens only once per process, so a second `import mymodule.py` in the same process gives access to the code in mymodule.py but does not execute the mymodule.py script again.

Comments are started with `#` character
Multiline comments use `"""` to start and end the comment

Variable declaration occurs at assignment, ie. There is no “`var`” or similar keyword.  Strings are in double or single quotes.  Lists are in `[]` and can contain any type:
`stuff = [1,2,'abc','xyz',3.14159]`

Elements are accessed with [] notation:
```python
stuff[0] #1
stuff[4] #3.14159
stuff[-1] #3.14159
stuff[-4] #1
```

Built-in functions (BIF) examples include print() and len():
`len(stuff) #5`

lists have methods such as append, insert, remove:
```python
stuff.append('new thing')
stuff.insert(0, 'first thing')
stuff.remove('xyz')
```

iterating a list is simple:
```python
for thing in stuff:
	print(thing)
```

while loops:
```python
counter = 0
while counter < len(stuff):
	print(stuff[counter])
	counter = counter + 1
```

ifs:
```python
if stuff[1] >=1 :
	print('this is true')
else:
	print('mistakes were made')
```

function:
```python
def function_name(param1, param2):
	return param1 + param2
function_name(2,34)
```

A simple module might contain nothing but a single function def like the one above
The import statement creates a namespace of the same name (the top level script has namespace `__main__`) so to use the module described:
```python
import mymodule
mymodule.function_name(2,34) #36
```
