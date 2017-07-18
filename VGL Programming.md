# VGL Programming

## Preliminary info

No one knows what VG stands for.

Built-in programs usually start with `$`.  Custom programs should avoid names that start with `$`.

Some of the built-in programs are ok to be modified.

There is a help file for VGL programming in `Help\Programmers_Guid.chm`.


### Files
- Source code is saved in files with the `.rpf` extension.  
- Compiled bits are in `.rpc` files.
- Listing files are created during compilation in `.lis` files, which contain source code, line numbers, global variables accessed, etc.
- Include files are created during compilation if a `GLOBAL ROUTINE` or `GLOBAL CONSTANT` is defined.  The existence of an `.inc` file is therefore an indication that the program is considered a "library".


## Variables, Constants, Arrays

Comments are delimited with `{ }`.

Variables do no require explicit declaration.  Just an assignment.  Variable names are case-insensitive.  Underscore characters are effectively removed from variable names during compilation.  So this works:

```
var1 = "x"
FLASH_MESSAGE(VAR_1, true)
```

Constants require the keyword `CONSTANT`.  Best practice is to use uppercase:

```
CONSTANT PI = 3.14159
```

Arrays use the keyword and optional specified sizing.  Indices start at 1:

```
ARRAY my_list_dynamic
ARRAY my_vector ARRAYSIZE(10)
ARRAY my_matrix ARRAYSIZE(3, 5) { declares 3 rows, 5 columns }
ARRAY my_floppy_array ARRAYSIZE(0, 3) { declares unknown row count, 3 columns }
```

The ARRAY_INITIAL keyword specifies an initial row count:

```
ARRAY my_array ARRAY_INITIAL(20) { 20 rows to start, but dynamic}
ARRAY my_floppy ARRAYSIZE(0) ARRAY_INITIAL(20) 
```


## Operators, Functions, and Types

Boolean logic should use `AND`, `OR`, and `NOT` rather than characters `&`, '|', and '!' which are available for backward compatibility with older language versions.

Some built in functions include:

```
ABS(-5) { 5 }
RANDOM(0) { returns number from 0 to 1 }
ROUND(42.64123) { 43 }
TRUNC(99.97) { 99 }
```

Types can be one of the following:

- Text
- Integer
- Real
- Boolean
- Packed Decimal:  integer as right-justified (padded) string
- Date: includes time component with ms precision
- Interval: ms precision
- Special: types such as `EMPTY` which is returned from a routine using an empty `RETURN` statement


## Loops

The `REPEAT` loop is performed at least once, subsequent executions are determined based on the evaluation of the condition following the `UNTIL` keyword, which ends the loop block:

```
REPEAT
    { more statements }
UNTIL i = 0
```

The `WHILE` loop is performed zero or more times, depending on the evaluation of the supplied condition:

```
WHILE condition DO
    { statements }
ENDWHILE
```


## Branching

Branching statments can have zero or more `ELSEIF` and zero or one `ELSE` components:

```
IF condition THEN
    { some action }
ELSEIF other_condition THEN
    { different action }
ELSE
    { another action }
ENDIF
```




## Routines

Routines are declared using `ROUTINE` and `ENDROUTINE` keywords:

```
JOIN LIBRARY $lib_utils
do_message()

ROUTINE do_message
    FLASH_MESSAGE("Something has been done", true)
ENDROUTINE
```

Including parameters:

```
JOIN LIBRARY $lib_utils
x = 3
y = 4
calc_hypoteneuse(x, y)

ROUTINE calc_hypoteneuse(a, b)
    FLASH_MESSAGE(SQRT((a*a) + (b*b)), true)
ENDROUTINE
```

Note that literals cannot be passed as routine parameters, i.e. `calc_hypoteneuse(3, y)` above would cause a compiler error that "Parameter previously used as a value expression".  Accordingly, an expression cannot be used as a parameter.  So something like `my_routine(a*a)` is not valid.

A function is created by including a `RETURN` statement in the routine:

```
JOIN LIBRARY $lib_utils
a = 3
b = 4
hypot = calc_hypoteneuse(a,b)

ROUTINE calc_hypoteneuse(a, b)
    RETURN (SQRT((a*a) + (b*b)))
ENDROUTINE

FLASH_MESSAGE(hypot, TRUE)
```

The `RETURN` statement requires parentheses if returning a value.  The `RETURN` statement can be used without specifying a value, in which case the value `EMPTY` is returned.

By default, parameters are passed by reference.  To pass a parameter by value (to create a copy of the passed value so the routine uses data local to itself), the `VALUE` keyword is used in the routine's declaration:

```
ROUTINE do_stuff(a, VALUE b, VALUE c)
```


## Scope

Variables and constants are accessible throughout a program's execution.  If a variable is initialized in the beginning of a program, a routine can later get and modify that variable's value.

The `DECLARE` statement explicitly creates a variable within a routine, program, or library:

```
DECLARE a, b, c
```

A variable declared in a routine is scoped only to that routine.  If a routine declares a variable previously declared, the previously declared variable is hidden until the routine's scope ends.  

Previous examples which initialized variables with values without declaring them are not considered best practice.  It is recommended that all variables are declared.  To enforce checking of variable declaration, use the line `SET COMPILE_OPTION DECLARE` in the beginning of the program.

By default, a `ROUTINE` is available only in the file where it is defined.  To create a routine accessible in other programs (which will use `JOIN LIBRARY` to include the library code), use `GLOBAL ROUTINE`.  A potential problem arises if two libraries containing a global routine of the same name are joined to a program.  To avoid compilation errors in situations such as this, remove the join to one of the libraries and instead use `CALL_ROUTINE` to explicitly call its routine with the duplicated name:

```
CALL_ROUTINE routine_name USING param1, param2, ... param_n RETURNING var_name IN LIBRARY lib_name
```

Some libraries are not VGL libraries, but standard C libraries.  They can be joined using `JOIN STANDARD_LIBRARY <name>`.  The standard libraries available include: STD_ARRARY, STD_ARRAY_EDITOR, STD_SELECT, STD_BROWSE, STD_DATABASE, STD_FLAGS, STD_GENERAL, STD_LINE_EDITOR, STD_LIST_EDTIOR, STD_MENU, STD_OUTPUT, STD_PROMPT, STD_STRUCTURE, STD_USER_GLOBAL.

For example, the STD_PROMPT standard library contains the `prompt_in_window` routine which creates a prompt for a record from a specified table:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
sample_id = 1
prompt_in_window("SAMPLE", "text to prompt", "header window", EMPTY, sample_id)
flash_message(sample_id, TRUE) { shows sample ID selected in window }
```


## Forms

VGL forms are created using the standard library STD_PROMPT.  Forms are objects, which are instantiated from classes, such as the PROMPT_CLASS_FORM class defined in STD_PROMPT:

```
JOIN STANDARD_LIBRARY STD_PROMPT
CREATE OBJECT PROMPT_CLASS_FORM, my_form
```

Properties and methods on the form object are accessed via the `.` syntax, i.e. `my_form.height = 25` and `my_form.start_prompt()`.  Form properties include:

| Prop                 | Description                                                             |
|----------------------|-------------------------------------------------------------------------|
| height               | Form height in lines                                                    |
| width                | Form width in characters                                                |
| row                  | Screen target row for form                                              |
| column               | Screen target column for form                                           |
| header               | Text to display in form header                                          |
| return_behavior      | FORM_RETURN_LEAVE, FORM_RETURN_STAY, FORM_RETURN_WRAP                   |
| icon                 | Sets icon in header (by name)                                           |
| active_prompt        | Indicates which prompt is active using index number from prompt_objects |
| confirm_required     | Set to TRUE to force confirmation                                       |
| do_confirm_message   | Message displayed when OK and confirm_required is TRUE                  |
| exit_confirm_message | Message displayed when Exit and confirm_required is TRUE                |


Important form actions include:

| Action       | Description                                                   |
|--------------|---------------------------------------------------------------|
| add_prompt   | Attaches prompt objects to a form (added to `prompt_objects`) |
| add_display  | Adds display elements to a form                               |
| start_prompt | Shows form on screen                                          |
| wait_prompt  | Activates prompts and displays objects, allowing user input   |
| end_prompt   | Removes form from screen when exited                          |
| set_position | Sets to the position specified in `prompt_objects`            |
| stop_prompt  | Stops the form operation                                      |


A simple example of building and displaying a form uses `add_display` with four params: the text to display, the row on the form to use, the column on the form to use, and the rendition, which is a sum of the following constants `PROMPT_RENDITION_ITALIC`, `PROMPT_RENDITION_NORMAL`, `PROMPT_RENDITION_UNDERLINE`, `PROMPT_RENDITION_INVERSE`, `PROMPT_RENDITION_LOWERED`, `PROMPT_RENDITION_STRIKETHROUGH`.  The `get_lastkey` method will return "DO" if the "OK" button was clicked to exit the form, or will return "EXIT" if the "Cancel" button was clicked.

```
SET COMPILE_OPTION DECLARE
ENABLE WINDOWS

JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
DECLARE my_form
CREATE OBJECT PROMPT_CLASS_FORM, my_form
my_form.header = "Example form"
my_form.column = 3
my_form.row = 6
my_form.height = 4
my_form.width = 40
my_form.confirm_required = TRUE
my_form.return_behaviour = FORM_RETURN_WRAP
my_form.add_display("Start time: ", 2, 1, PROMPT_RENDITION_NORMAL)
my_form.add_display("End time: ", 2, 2, PROMPT_RENDITION_NORMAL)
my_form.add_display("Time diff: ", 2, 3, PROMPT_RENDITION_NORMAL)
my_form.start_prompt()
my_form.wait_prompt()
my_form.end_prompt()
FLASH_MESSAGE(my_form.get_lastkey(), true)
```

## Prompts

