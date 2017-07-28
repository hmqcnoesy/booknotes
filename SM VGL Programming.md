# VGL Programming

## Preliminary info

No one knows what VG stands for.

Built-in programs usually start with `$`.  Custom programs should avoid names that start with `$`.

Some of the built-in programs are ok to be modified.

There is a help file for VGL programming in `Help\Programmers_Guide.chm`.


## Files
- Source code is saved in files with the `.rpf` extension.  
- Compiled bits are in `.rpc` files.
- Listing files are created during compilation in `.lis` files, which contain source code, line numbers, global variables accessed, etc.
- Include files are created during compilation if a `GLOBAL ROUTINE` or `GLOBAL CONSTANT` is defined.  The existence of an `.inc` file is therefore an indication that the program is considered a "library".


## Variables, Constants

Comments are delimited with `{ }`.

Variables do not require explicit declaration.  Just an assignment.  Variable names are case-insensitive.  Underscore characters are effectively removed from variable names during compilation.  So this works:

```
var1 = "x"
FLASH_MESSAGE(VAR_1, true) { displays "x" in message box }
```

Constants require the keyword `CONSTANT`.  Best practice is to use uppercase:

```
CONSTANT PI = 3.14159
```


## Arrays

Arrays use the `ARRAY` keyword and optional specified sizing.  

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

Array elements are accessed using `[]` notation.  Indices start at 1:

```
ARRAY my_list
my_list[1] = 1
my_list[2] = 3
my_list[3] = 5
my_list[4] = 7
my_list[5] = 11
```

Multi-dimensional arrays' indices are separated with a comma:

```
ARRAY items ARRAYSIZE(3,2) { 3 rows, 2 columns }
items[1,1] = "a"
items[1,2] = "b"
items[2,1] = "c"
items[2,2] = "d"
items[3,1] = "e"
items[3,2] = "f"
```

Many helpful routines dealing with arrays can be found in the `STD_ARRAY` standard library.  Row counts of arrays can be determined using `size_of_array()`:

```
JOIN STANDARD_LIBRARY std_array
JOIN LIBRARY $lib_utils
ARRAY items ARRAYSIZE(3,2) { 3 rows, 2 columns }
items[1,1] = "a"
items[1,2] = "b"
items[2,1] = "c"
items[2,2] = "d"
FLASH_MESSAGE(size_of_array(items), TRUE) { 2 }
```

In the example above, "2" is displayed even though the array was declared having 3 rows, only two are populated, so the size is returned as 2.  If elements in row 3 were populated instead of elements in row 2, the size would be reported as 3.

To copy an array:

```
JOIN STANDARD_LIBRARY std_array
JOIN LIBRARY $lib_utils
ARRAY items ARRAYSIZE(3,2) { 3 rows, 2 columns }
items[3,2] = "d"
array_copy(new_array, items)
flash_message(new_array[3,2], TRUE) { "d" }
```

To check for existence of an array element, use `array_element_exists` which takes two arrays.  The second array must contain element indices for each dimension:

```
JOIN STANDARD_LIBRARY std_array
JOIN LIBRARY $lib_utils
ARRAY items ARRAYSIZE(3,2) 
ARRAY indices ARRAYSIZE(2)
indices[1] = 3 { first dimension }
indices[2] = 1 { second dimension }
flash_message(array_element_exists(items, indices), TRUE) { false, nothing there yet }
items[3,1] = "something"
flash_message(array_element_exists(items, indices), TRUE) { true, value has been set }
indices[2] = 3
flash_message(array_element_exists(items, indices), TRUE) { false, outside array bounds }
```

To insert a row into an existing array (pushing subsequent existing rows "down"), use `array_insert_slice` with a paramter for the target array, a parameter for the dimension, and a parameter defining the row/column for insertion:

```
JOIN STANDARD_LIBRARY std_array
JOIN LIBRARY $lib_utils
ARRAY items ARRAYSIZE(3,2) 
items[1,1] = "a"
items[1,2] = "b"
items[2,1] = "c"
items[2,2] = "d"
items[3,1] = "e"
items[3,2] = "f"
array_insert_slice(items, 1, 2)
flash_message(items[1,1], TRUE) { "a", unchanged }
flash_message(items[2,1], TRUE) { empty, nothing there yet }
flash_message(items[3,1], TRUE) { "c", shifted down by insertion }
```

Likewise, to remove a row:

```
JOIN STANDARD_LIBRARY std_array
JOIN LIBRARY $lib_utils
ARRAY items ARRAYSIZE(3,2) 
items[1,1] = "a"
items[1,2] = "b"
items[2,1] = "c"
items[2,2] = "d"
items[3,1] = "e"
items[3,2] = "f"
array_remove_slice(items, 1, 2)
flash_message(items[1,1], TRUE) { "a", unchanged }
flash_message(items[2,1], TRUE) { "e", shifted up by removal }
flash_message(items[3,1], TRUE) { error, past the array bounds after removal }
```

To sort an array, use `array_sort` with a second paramter of one of the constants `ARRAY_SORT_ASCENDING` or `ARRAY_SORT_DESCENDING`:

```
JOIN STANDARD_LIBRARY std_array
JOIN LIBRARY $lib_utils
ARRAY items ARRAYSIZE(6) 
items[1] = "q"
items[2] = "b"
items[3] = "c"
items[4] = "t"
items[5] = "w"
items[6] = "x"
array_sort(items, ARRAY_SORT_ASCENDING)
flash_message(items[1], TRUE) { "b" }
flash_message(items[2], TRUE) { "c" }
flash_message(items[3], TRUE) { "q" }
```

Sorting on a multi-dimensional array is performed on the value of the first column values:

```
JOIN STANDARD_LIBRARY std_array
JOIN LIBRARY $lib_utils
ARRAY items ARRAYSIZE(3,2) 
items[1,1] = "q"
items[1,2] = "b"
items[2,1] = "c"
items[2,2] = "t"
items[3,1] = "w"
items[3,2] = "x"
array_sort(items, ARRAY_SORT_ASCENDING)
flash_message(items[1,2], TRUE) { "t" }
flash_message(items[2,2], TRUE) { "b" }
flash_message(items[3,2], TRUE) { "x" }
```

To sort by values in a specified column, use `array_complex_sort`:

```
JOIN STANDARD_LIBRARY std_array
JOIN LIBRARY $lib_utils
ARRAY items ARRAYSIZE(3,2) 
items[1,1] = "q"
items[1,2] = "b"
items[2,1] = "c"
items[2,2] = "t"
items[3,1] = "w"
items[3,2] = "x"
ARRAY indices ARRAYSIZE(1)
indices[1] = 2 { going to sort on second column }
array_complex_sort(items, indices, ARRAY_SORT_DESCENDING)
flash_message(items[1,1], TRUE) { "w" }
flash_message(items[2,1], TRUE) { "c" }
flash_message(items[3,1], TRUE) { "q" }
```


## Operators, Functions, and Types

The text concatenation operator is `:`:

```
oper_name = "jane"
msg = "hello, " : oper_name
{ msg is "hello, jane" }
```

There's also a string subtraction operator, `#`, which removes the first occurrence of a string:

```
msg = "hello, jane"
new_msg = msg # "ll"
{ new_msg is "heo, jane" }
```

Boolean logic should use `AND`, `OR`, and `NOT` rather than characters `&`, `|`, and `!` which are available for backward compatibility with older language versions.

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
- Special: types such as `EMPTY` which is implicitly returned from a routine using an empty `RETURN` statement, and `ERROR` which is returned by some routines if passed paramters cause a problem


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

Branching statments require `IF` followed by a condition expression, followed by `THEN`.  They can have zero or more `ELSEIF`/`THEN` and zero or one `ELSE` components.  The `ENDIF` keyword is required to end the construction:

```
IF condition THEN
    { some action }
ELSEIF other_condition THEN
    { different action }
ELSE
    { another action }
ENDIF
```

Evidently there is no way to short-circuit expression evaluation using boolean operators.  In other words, the second condition below will be evaluated:

```
IF (1 = 2) AND (limit_value = EMPTY) THEN
    { statements }
ENDIF
```


## Routines

Routines are declared using the `ROUTINE` and `ENDROUTINE` keywords:

```
JOIN LIBRARY $lib_utils
show_message()

ROUTINE show_message
    FLASH_MESSAGE("Something has been done", true)
ENDROUTINE
```

Routines can include parameters:

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
ROUTINE dostuff(a, VALUE b, VALUE c)
```

Note that parameters passed by value can enable calls passing literals.  The previous example that would cause a compiler error is OK when using the `VALUE` keyword:

```
JOIN LIBRARY $lib_utils
calc_hypoteneuse(4, 9) { messagebox 9.849 }

ROUTINE calc_hypoteneuse(VALUE a, VALUE b)
    FLASH_MESSAGE(SQRT((a*a) + (b*b)), true)
ENDROUTINE
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

Some libraries are not VGL libraries, but standard C libraries.  They can be joined using `JOIN STANDARD_LIBRARY <name>`.  The standard libraries available include: `STD_ARRARY`, `STD_ARRAY_EDITOR`, `STD_SELECT`, `STD_BROWSE`, `STD_DATABASE`, `STD_FLAGS`, `STD_GENERAL`, `STD_LINE_EDITOR`, `STD_LIST_EDTIOR`, `STD_MENU`, `STD_OUTPUT`, `STD_PROMPT`, `STD_STRUCTURE`, `STD_USER_GLOBAL`.

For example, the `STD_PROMPT` standard library contains the `prompt_in_window` routine which creates a prompt for a record from a specified table:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
sample_id = 1
prompt_in_window("SAMPLE", "text to prompt", "header window", EMPTY, sample_id)
flash_message(sample_id, TRUE) { shows sample ID selected in window }
```


## Forms

VGL forms are created using the standard library `STD_PROMPT`.  Forms are objects, which are instantiated from classes, such as the `PROMPT_CLASS_FORM` class defined in `STD_PROMPT`:

```
JOIN STANDARD_LIBRARY STD_PROMPT
CREATE OBJECT PROMPT_CLASS_FORM, my_form
```

Properties and methods on the form object are accessed via the `.` syntax, i.e. `my_form.height = 25` and `my_form.start_prompt()`.  Form properties include:

| Prop                   | Description                                                             |
|------------------------|-------------------------------------------------------------------------|
| `height`               | Form height in lines                                                    |
| `width`                | Form width in characters                                                |
| `row`                  | Screen target row for form                                              |
| `column`               | Screen target column for form                                           |
| `header`               | Text to display in form header                                          |
| `return_behavior`      | `FORM_RETURN_LEAVE`, `FORM_RETURN_STAY`, `FORM_RETURN_WRAP`                   |
| `icon`                 | Sets icon in header (by name)                                           |
| `active_prompt`        | Indicates which prompt is active using index number from `prompt_objects` |
| `confirm_required`     | Set to `TRUE` to force confirmation                                       |
| `do_confirm_message`   | Message displayed when OK and `confirm_required` is `TRUE`                  |
| `exit_confirm_message` | Message displayed when Exit and `confirm_required` is `TRUE`                |
| `prompt_id`            | Set to a unique string to get SM to remember window position/size           |


Important form actions include:

| Action         | Description                                                   |
|----------------|---------------------------------------------------------------|
| `add_prompt`   | Attaches prompt objects to a form (added to `prompt_objects`) |
| `add_display`  | Adds display elements to a form                               |
| `start_prompt` | Shows form on screen                                          |
| `wait_prompt`  | Activates prompts and displays objects, allowing user input   |
| `end_prompt`   | Removes form from screen when exited                          |
| `set_position` | Sets to the position specified in `prompt_objects`            |
| `stop_prompt`  | Stops the form operation                                      |


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

To request user input, create a prompt.  For example:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
SET COMPILE_OPTION DECLARE
DECLARE my_prompt, oper_name
PROMPT OBJECT my_prompt
    AT 6.2, 6.5
    FORMAT TEXT_30
oper_name = my_prompt.text
FLASH_MESSAGE(oper_name, TRUE)
```

The `AT` keyword allows specification of x and y coordinates for the prompt.  The `FORMAT` keyword allows specification of the input datatype and size.  

Other options for prompt objects include `BROWSE ON <value>` which allows specification of a table, allowing the user to pick a record.  The `THEN SELECT` keywords store the user-selected record in the prompt object for later use, but the record is not locked in the database.  Using `THEN SELECT FOR UPDATE` will store the record data and lock the record in the database:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
SET COMPILE_OPTION DECLARE
DECLARE samp_id
PROMPT OBJECT samp_id
    AT 6.2, 6.5
    BROWSE ON sample
    THEN SELECT FOR UPDATE
```

The `CHOOSE OUTOF array_name` keywords can be used to specify menu choices for the prompt:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
SET COMPILE_OPTION DECLARE
DECLARE my_form, my_prompt, choices

CREATE OBJECT PROMPT_CLASS_FORM, my_form
my_form.height = 4
my_form.width = 40
my_form.add_display("Pick: ", 2, 1, PROMPT_RENDITION_NORMAL)

ARRAY choices ARRAYSIZE(0,3)
choices[1,1] = "Yesterday"
choices[1,2] = -1
choices[2,1] = "Today"
choices[2,2] = 0
choices[3,1] = "Tomorrow"
choices[3,2] = 1
PROMPT OBJECT my_prompt
    AT 3, 2
    CHOOSE OUTOF choices

my_form.add_prompt(my_prompt)

my_form.start_prompt()
my_form.wait_prompt()
my_form.end_prompt()
```

The `BROWSE ON` command can specify more than just a table name.  The command can be used with a datatype, a database table (with or without a column specified), a phrase, and more:

- `BROWSE ON BOOLEAN`: Prompts for "Yes" or "No"
- `BROWSE ON INTEGER`: Prompts for integer value
- `BROWSE ON REAL`: Prompts for numeric value
- `BROWSE ON DATE`: Prompts for date, defaulted to current date
- `BROWSE ON DATETIME`: Prompts for date, including time component
- `BROWSE ON INTERVAL`: Prompts for time interval in days/hours/minutes/seconds
- `BROWSE ON IDENTITY`: Prompts for left-justified uppercase 10-char-wide string value
- `BROWSE ON IDENTITY_<len>`: Prompts for identity with length other than 10
- `BROWSE ON DATE_OR_INTERVAL`: Prompts for a date or a interval from current
- `BROWSE ON SAMPLE_TESTS`: Prompts for analyses assigned to the sample specified in `sample_id` property
- `BROWSE ON FILE`: Prompts for file, starting in directory in `file_directory` property, optionally filtered to types specified in `file_extension` property.
- `BROWSE ON PHRASE.<phrase_type>`: Prompts for values from specified phrase.
- `BROWSE ON VALID_PHRASE.<phrase_type>`: Prompts for values from specified phrase, without allowing custom input.
- `BROWSE ON PHRASE_ID.<phrase_type>`: Prompts for IDs from specified phrase.
- `BROWSE ON VALID_PHRASE_ID.<phrase_type>`: Prompts for IDs from specified phrase, without allowing custom input.

You can require user input to meet a specified format using the `FORMAT` command:

- `FORMAT DATE`
- `FORMAT DATETIME`
- `FORMAT INTERVAL`
- `FORMAT INTEGER`
- `FORMAT REAL`
- `FORMAT CHAR`
- `FORMAT TEXT_<length>` (max length is specified)
- `FORMAT FILE`
- `FORMAT Table.field` (Table must be a valid table name and field must be a valid column)

The `FORMAT` specifier actually causes different prompt classes to be instantiated.  All the prompts inherit from `STD_PROMPT_FIELD`, but for instance using `FORMAT INTEGER` causes a prompt of type `STD_PROMPT_TEXT_INTEGER` to be instantiated.

The `WITH` qualifier allows the prompt object's properties to be set, such as:

```
PROMPT OBJECT pick_a_number_1_to_100
    AT 10, 10
    FORMAT TEXT
    WITH (minimum = 1, maximum = 100)
```

Other properties that can be specified using `WITH` include:

- `height` (number of lines)
- `width` (number of characters)
- `row` (row position on form)
- `column` (col position on form)
- `allowed_chars` (string white list of allowed input characters)
- `always_validate` (boolean indicating if validation is performed when default values are used)
- `build_routine` (string name of routine to execute when build key is clicked on prompt)
- `can_exit_sideways` (allows user to exit prompt using arrow keys)
- `char_position` (integer position of current character in prompt)
- `cursor_position` (integer relative cursor position to start position)
- `double_entry` (boolean requiring double entry before input is accepted)
- `enabled` (boolean)
- `text` (string representing current value of prompt)
- `silent_mode` (boolean sets prompt to use password chars)
- `value` (string of current contents, can be used for initial value)
- `visible` (boolean that can be set to `FALSE` to hide the prompt from view)

Many other properties are available on prompts, including many type-specific properties.  They are all covered in the help file.

Callback routines can also be set as properties on a prompt.  For example: `WITH (leave_prompt_routine="my_routine")` will execute `my_routine` when the prompt loses focus.  Other callbacks include `browse_routine`, `enter_prompt_routine`, `insert_routine`, `leave_prompt_routine`, `remove_routine`, `select_routine`, and `validation_routine` (which should return a boolean indicating pass/fail of the validation).  Each of the callback routine definitions should take a single parameter, which is passed as the prompt object itself.

Some callbacks will require either the `vgl_library` to be set, or the library name to be included in the callback string value.  It is not clear from the documentation when this is required and when it is not.  An indication that this will be required would be an error like "Error from SampleManager server: Routine <routinename> has not been found in library ...".  To remedy this, either of these two solutions can be employed:

```
PROMPT OBJECT prmpt AT 20,1 BROWSE ON sample 
    WITH (leave_prompt_routine="selection_made", vgl_library=GLOBAL("current_library"))

PROMPT OBJECT prmpt AT 20,1 BROWSE ON sample
    WITH (leave_prompt_routine=GLOBAL("current_library") : "/selection_made")
```

Prompts are added to a form using the form's `add_prompt` action, and text is added using the `add_display` action.

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
DECLARE my_form, pick_a_number
CREATE OBJECT PROMPT_CLASS_FORM, my_form
my_form.header = "Number game"
my_form.height = 4
my_form.width = 40
my_form.return_behaviour = FORM_RETURN_WRAP
my_form.add_display("Pick a number between 1 and 3: ", 2, 1, PROMPT_RENDITION_NORMAL)

PROMPT OBJECT pick_a_number AT 30, 1 FORMAT INTEGER WITH (minimum = 1, maximum = 3, value = 1)
my_form.add_prompt(pick_a_number)

my_form.start_prompt()
my_form.wait_prompt()
my_form.end_prompt()

IF pick_a_number.value = 2 THEN
	FLASH_MESSAGE("You guessed it!", TRUE)
ELSE
	FLASH_MESSAGE("Sorry, you guessed " : NUMBER_TO_TEXT(pick_a_number.value, "9") : " but I was thinking of 2.", TRUE)
ENDIF
```

In the above example the user input value is accessed via the prompt object's property `pick_a_number.value`.  It could also be reached via the form's prompt objects array:  `my_form.prompt_objects[1].value`.

Here is an example of a prompt using `BROWSE ON` and a callback:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
DECLARE my_form, prompt_customer
CREATE OBJECT PROMPT_CLASS_FORM, my_form
my_form.width = 50
my_form.add_display("Customer: ", 2, 1, PROMPT_RENDITION_NORMAL)

PROMPT OBJECT prompt_customer AT 20, 1 BROWSE ON customer WITH (leave_prompt_routine="customer_selected")
my_form.add_prompt(prompt_customer)

my_form.start_prompt()
my_form.wait_prompt()
my_form.end_prompt()

ROUTINE customer_selected(the_prompt)
    FLASH_MESSAGE("You picked " : the_prompt.text, TRUE)
ENDROUTINE
```

Prompts using `BROWSE ON` can specify queries to limit available choices instead of allowing any record from the specified table.  This is done by joining to the `STD_ARRAY_SELECT` library and building a list of query criteria using the `ARRAY_SELECT_ADD` routine:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
JOIN STANDARD_LIBRARY STD_ARRAY_SELECT

DECLARE my_form, customer_id
CREATE OBJECT PROMPT_CLASS_FORM, my_form
my_form.width = 50
my_form.add_display("Customer: ", 2, 1, PROMPT_RENDITION_NORMAL)

ARRAY my_query
ARRAY_SELECT_ADD(my_query, ARRAY_SELECT_EQ, "IDENTITY", "PEDRO")
ARRAY_SELECT_ADD(my_query, ARRAY_SELECT_OR, EMPTY, EMPTY)
ARRAY_SELECT_ADD(my_query, ARRAY_SELECT_EQ, "IDENTITY", "JUAN_CUSTO")
PROMPT OBJECT customer_id AT 20, 1 BROWSE ON customer WITH (select_array = my_query)
my_form.add_prompt(customer_id)

my_form.start_prompt()
my_form.wait_prompt()
my_form.end_prompt()
```

The above example will display "PEDRO" and "JUAN_CUSTO" as the available customers to the user, but the user can adjust the criteria to pick another customer if desired.  To enforce selection of a record that meets the criteria, instead of using `WITH (select_array = my_query)`, use `WITH (mandatory_array = my_query)`.


## Lists 

Lists are objects added to forms that display information to the user in a listview.  The user can change the sorting to find items, and can select one or more items from the list, which can then be used in subsequent VGL code.

To create a list:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
JOIN LIBRARY $PROMPT_LIST

DECLARE list_form, the_list
CREATE OBJECT PROMPT_CLASS_FORM, list_form
list_form.height = 4
list_form.width = 50

CREATE OBJECT PROMPT_LIST_CLASS, the_list
the_list.height = list_form.height - 1
the_list.width = list_form.width - 2
the_list.row = 1
the_list.column = 1
the_list.add_column("Col1 header", 12)
the_list.add_column("Col2 header", 25)
the_list.insert_item("Item 1", EMPTY) { 2nd arg is optional icon name }
the_list.set_item(2, "Item 1 details")
the_list.insert_item("Item 2", EMPTY)
the_list.set_item(2, "Item 2 details")
the_list.insert_item("Item 3", EMPTY)
the_list.set_item(2, "Item 3 details")

list_form.add_prompt(the_list)
list_form.start_prompt()
list_form.wait_prompt()
list_form.end_prompt()
```

Note that for some undocumented reason, `$lib_utils` must be joined.  As shown in the example above, a list is a type of a prompt object.  The object has properties, actions, and callbacks specific to the `PROMPT_LIST_CLASS` type.  For instance, a callback can be set for `double_click_routine`:  

```
the_list.double_click_routine = "sample_details"
ROUTINE sample_details(prompt_object)
    DECLARE selected_item
    prompt_object.get_first_selected(selected_item)
    FLASH_MESSAGE("You selected: " : selected_item, TRUE)
ENDROUTINE
```

A list can be styled by settings its integer `style` property.  The default value is `LIST_STYLE_REPORT + LIST_STYLE_SHOW_SEL_ALWAYS + LIST_STYLE_HEADER_DRAG_DROP + LIST_STYLE_FULL_ROW_SELECT`.  Thanks to the integral nature of the style constants, additional settings can be applied by adding or subtracting the constant value from the style property, e.g. `the_list.style = the_list.style + LIST_STYLE_GRID_LINES`.  Additional style constants include:

- `LIST_STYLE_ALIGN_LEFT` (icons at left)
- `LIST_STYLE_ALIGN_TOP` (icons at top)
- `LIST_STYLE_NO_COLUMN_HEADER`
- `LIST_STYLE_NO_SCROLL`
- `LIST_STYLE_NO_SORT_HEADER`
- `LIST_STYLE_ONE_CLICK_ACTIVATE`
- `LIST_STYLE_TWO_CLICK_ACTIVATE` ("normal" behavior)
- `LIST_STYLE_SINGLE_SEL` (disables multi-select behavior)
- `LIST_STYLE_SORT_ASCENDING` (initial display is sorted by label text)
- `LIST_STYLE_SORT_DESCENDING` (initial display is sorted in desc order)

A list object can have these callback routines specified:

- `double_click_routine` (called when an item is double-clicked)
- `selected_routine` (called each time an item is clicked)

And a list has these useful actions (among others):

- `autosize_column(column_number, mode)` (mode should be 0 for resizing to content, 1 for resizing to header)
- `get_first_selected(return_text)` (returns an index of item, but more importantly sets return_text to first selected item's text label)
- `get_next_selected(return_text)` (can be called like `get_first_selected`, but in a loop until `EMPTY` is returned)
- `get_item(item_no, column_no)` (returns the text for the item/column specified)
- `is_item_checked(item_no)` (returns `TRUE` if the item has a checkbox and is checked)

To use icons for list items, join to `$TOOLBOX` which contains constants pointing to standard icons, and set the `use_images` property on the list object to `TRUE`.  In the calls to the list's `insert_item` action, provide the appropriate `$TOOLBOX` constant, such as `the_list.insert_item("First item", ICON_HAPPY_FACE)`.  Custom bitmap images can also be used, see help file for info.

Checkboxes can be displayed on lists so that users don't have to use Ctrl/Shift clicks to make multiple selections:

```
the_list.style = the_list.style + LIST_STYLE_CHECK_BOXES
```

## Strings

Some useful built-in string functions and commands include:

- `TOUPPER(str)`
- `TOLOWER(str)`
- `STRIP(str)` (in-place trim of leading and trailing spaces from `str`)
- `PAD(str1, str2, pad_count)` (pads `str1` with `str2` to total of `pad_count` characters)
- `JUSTIFY(str1, str2)` (`str2` must be `LEFT` or `RIGHT`, spaces are from beginning to end or vice-versa to maintain original string length)
- `INDEX(str1, str2)` (searches `str1` for an occurence of `str2` and returns `0` if not found or 1-based index of first occurence if found)
- `lib_text_reverse_index(str1, str2)` (in library `$LIB_TEXT`, same as `INDEX` but search is done in reverse)
- `lib_text_is_like(text, pattern, single_wildcard, multi_wildcard)` (in library `$LIB_TEXT`, returns `TRUE` if `text` matches `pattern` with specified wildcards, usually `single_wildcard = '_'` and `mult_wildcard = '%'`)
- `LENGTH(str)` (contrary to training manual's description, this apparently returns the length of a string with trailing spaces/tabs removed - _leading spaces are counted_)
- `STRINGLENGTH(str)` (returns the length of a string without removing any spaces)
- `LEFTSTRING(str, count)` (returns new string of left-most `count` characters)
- `RIGHTSTRING(str, count)` (returns new string of right-most `count` characters)
- `SUBSTRING(str, start_pos, count)` (`start_pos` is 1-based; returned string will be padded with spaces if the `count` overshoots the end of the string)
- `ASCII(VALUE int_value)` (converts `65` to `A`, etc.)
- `ORD(str)` (converts `A` to `65`, etc.)
- `NOW` (returns current date/time)
- `TODAY` (returns current date)
- `STRING(value)` (returns string using current `SET FORMAT` if defined)
- `NUMTEXT(value)` (returns `TRUE` if `value` can be converted to a real)
- `NUMERIC(str)` (returns real datatype of parsed `str`)
- `NUMBER_TO_TEXT(num, format_str)` (formats number as a string, `format_str` should be something like `"999.999"`)
- `BLANK(str)` (returns `TRUE` if `str` is an empty or blank - tabs/spaces)
- `get_token(str, separator)` (in `$LIB_UTILS`, `str` must be a reference - the substring of `str` up to the first instance of `separator` is returned, the remainder of the string is stored in `str`)
- `SUBSTITUTE(str1, str2, str3)` (returns a new string formed by finding instances in `str1` of any of the characters in `str2` and replacing them with characters in corresponding positions in `str3`)
- `lib_text_replace(str1, str2, str3)` (in library `$lib_text` - returns a new string replacing instances of `str2` in `str1` with `str3` value)
- `DATE(str)` (converts a string to a date type, must be 'dd-MON-yyyy' or 'dd-MON-yyyy hh24:mi' format)
- `INTERVAL(str)` (converts a string to an interval type, must be 'dddd hh24:mi:ss' format, including leading zeroes for days)
- `DAYNUMBER(date_str)` (returns integer where 1 is Monday, 7 is Sunday)
- `SET DATE FORMAT str` (command defines how dates are displayed, see help docs for format strings)
- `SET FORMAT str` (command defines how numbers are displayed, default is "999999.999")

The `SET FORMAT` commands are held on a stack, so they are superseded by subsequent `SET FORMAT` commands.  Popping the last format on the stack is possible with `RESTORE FORMAT`.


## Files

To open an existing file, use the `FILE OPEN file_name, chk` command where `file_name` is the file name (assuming user files directory) and `, chk` is optional and will be set to `EMPTY` if the open operation succeeds, or an error if not.

After opening, a file can be read using `FILE READ file_name, file_line, chk`.  The contents of the current line are stored in `file_line`, so a loop is required to read through an entire file.  The `chk` variable will be set to `EMPTY` each time a line is read successfully.  When an attempt is made to read a line after the cursor has moved past the last line of the file, `chk` will be set to an error and `file_line` will be set to "Attempted to read past end of text file".

After reading, a file must be closed using `FILE CLOSE file_name, chk`.  The `chk` will be set to `EMPTY` if the file is closed successfully.

To move to the top of a file, use `FILE TOP file_name, chk`.  

To check if a file exists, use `exists = FILE EXISTS(file_name)` where `file_name` is a full path.

To create a new file, use `FILE CREATE new_file_name, chk`.  The file is placed in the "Exe" directory, unless a full path is specified.  The `chk` variable is set to `EMPTY` if file creation succeeds.  _An existing file will be silently overwritten._

To append to an existing file, use `FILE EXTEND file_name, chk`.  This command opens the file for writing and puts the cursor at the end of the file.  Then the `FILE WRITE` command can be used to append.

To write to a file at the current cursor position, use `FILE WRITE file_name, str_to_write, chk`.  This writes one line at a time and appends `\r\n` to your `str_to_write` text.

To copy an existing file, use `FILE COPY source_file, target_file_name, chk`.  If the destination filename already exists it will be silently overwritten.  Likewise, to delete an existing file, use `FILE DELETE file_name, chk`.


## VGL Menus

To create a menu on a form using an array, use `CHOOSE OUTOF` (apparently no library joins required):

```
JOIN LIBRARY $lib_utils
ARRAY menu_items ARRAYSIZE(0, 3) { unknown row count, 3 columns }
menu_items[1,1] = "*"
menu_items[1,2] = "This is the menu title"
menu_items[2,1] = ""
menu_items[2,2] = "First display item"
menu_items[2,3] = 1
menu_items[3,1] = ""
menu_items[3,2] = "Second item"
menu_items[3,3] = 2
menu_items[4,1] = ""
menu_items[4,2] = "Third"
menu_items[4,3] = 3

CHOOSE example_menu OUTOF menu_items AT 10, 10
FLASH_MESSAGE("You picked " : example_menu, TRUE)
```

If the number of rows are known, declare it in `ARRAYSIZE`.  There must be 3 columns in the array used with the `OUTOF` keyword.  The first row must contain `"*"`, and a value for the menu window's title in the second element.  Rows 2 onward must contain an unused string in the first column (pre-Windows shortcut key?), the value to display in the second column, and the value to store in the `CHOOSE` variable when the user makes a selection.   

As in the "Prompts" example earlier, a dropdown menu can be created using the `CHOOSE OUTOF` keywords and a two-column array to describe the options: 

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
SET COMPILE_OPTION DECLARE
DECLARE my_form, my_prompt, choices

CREATE OBJECT PROMPT_CLASS_FORM, my_form
my_form.height = 2
my_form.width = 40
my_form.add_display("Pick: ", 2, 1, PROMPT_RENDITION_NORMAL)

ARRAY choices ARRAYSIZE(0,3)
choices[1,1] = "First option"
choices[1,2] = 1
choices[2,1] = "Second option"
choices[2,2] = 2
choices[3,1] = "Third option"
choices[3,2] = 3

PROMPT OBJECT my_prompt
    AT 12, 1
    CHOOSE OUTOF choices

my_form.add_prompt(my_prompt)

my_form.start_prompt()
my_form.wait_prompt()
my_form.end_prompt()
```

Another option for creating a menu is `CALL_MENU OUTOF`, which calls routines specified by names in the array used to create the menu.  The routine name is in the fourth column, the library is in the third column:

```
JOIN LIBRARY $lib_utils
DECLARE choices

ARRAY choices ARRAYSIZE(0,4)
choices[1,1] = "*"
choices[1,2] = "Window header"
choices[2,1] = ""
choices[2,2] = "Get some info"
choices[2,3] = GLOBAL("current_library")
choices[2,4] = "get_info"
choices[3,1] = ""
choices[3,2] = "Show a message"
choices[3,3] = GLOBAL("current_library")
choices[3,4] = "show_message"

CALL_MENU OUTOF choices AT 1,1

ROUTINE get_info(option)
	FLASH_MESSAGE("Get_info was called: " : option, TRUE)
ENDROUTINE

ROUTINE show_message(option)
	FLASH_MESSAGE("Show_message was called: " : option, TRUE)
ENDROUTINE
```

The `MENUPROC` keyword allows calling an existing master menu item by ID and passing necessary parameters.

```
MENUPROC 81 USING "SYSTEM"
```

In the example above, `81` is the ID for item "Modify Operator" and `"SYSTEM"` is the ID of the operator record we want to modify.  If no parameters are required for an operation, the `USING p1, p2, ...` can be left out.  For example, to add a customer:

```
MENUPROC 2
```

At the end of the `USING` paramter list, a virtual keypress can also be passed, as either the string `"$EXIT"` or `"$DO"`.

The `MENUPROC` keyword can be used to call another VGL program that is not a master menu item by calling master menu item 56 ("GRL") and passing a first paramter that is the name of the VGL program to run, followed by the parameter list to pass to that program.


## Reading from the Database

Reading data requires a read transaction, which is created using `START READ TRANSACTION` followed by a transaction name.  If the read transaction is not started, auditing information will not be correctly saved.

Simple data retrieval is done via SQL select statements without `FROM` clauses - the `SELECT` clause must indicate the table.field(s) to pull from.  Entire table records are queried from the database, not just the field(s) specified, so subsequent `SELECT` statements will pull from in-memory data (consequently, the `WHERE` clause is not needed).  Assignment of a variable to a `SELECT` expression results in a single (first matching) record being loaded into the variable (and cache).  In other words, a `SELECT` command without a `WHERE` will select from an in-memory record, and retrieval of data from the database *requires* a `WHERE` clause.

```
JOIN LIBRARY $lib_utils
START READ TRANSACTION "tx"
oper_id = SELECT personnel.identity WHERE name NOT LIKE "Sys%" ORDER ON identity
oper_name = SELECT personnel.name
mod_on = SELECT personnel.modified_on
FLASH_MESSAGE(oper_id, TRUE)
NEXT personnel
oper_id = SELECT personnel.identity
FLASH_MESSAGE(oper_id, TRUE)
```

String literals are delimited with `"`, not `'` as in standard SQL.

After getting one value from a query, the `NEXT` command can be used to point subsequent `SELECT` commands at the next record's value(s).  If `NEXT` points past all records retrieved from the database, a `SELECT` command will set the variable to `EMPTY`.  With this in mind, a loop for processing query results can be constructed:

```
JOIN LIBRARY $lib_utils
START READ TRANSACTION "tx"
oper_name = SELECT personnel.identity WHERE identity != 1 ORDER ON identity
oper_list = ""
WHILE oper_name <> EMPTY DO
    oper_list = oper_list : oper_name
    NEXT personnel
    oper_name = SELECT personnel.identity
ENDWHILE

FLASH_MESSAGE(oper_list, TRUE)
```

Ordering query results is accomplished using the `ORDER ON` which is similar to a SQL `ORDER BY` except that the default ordering is descending.  To explicitly state ordering, use `ASCENDING` or `DESCENDING` after the field name.

Jobs, samples, tests, and results are by default retrieved from the active tables.  The `SET MODE` command can switch to other table sets if needed.

The `DISTINCT` keyword can query for distinct records, but doesn't seem to work correctly when used with a loop.  Also, counts can be queried using `var = SELECT COUNT {DISTINCT} table.field WHERE expr`.

```
JOIN LIBRARY $lib_utils
START READ TRANSACTION "tx"
modby = SELECT COUNT DISTINCT personnel.modified_by WHERE modified_by != "INSTALL" 
FLASH_MESSAGE(modby, TRUE) { 1 }
modby = SELECT COUNT personnel WHERE modified_by = "INSTALL"
FLASH_MESSAGE(modby, TRUE) { 2 }
```

Note that the `COUNT DISTINCT` requires a field name, but `COUNT` without `DISTINCT` may have only a table name.

Other supported aggregate functions include `MIN`,`MAX`,`SUM`, and `AVG`.

The `READ_LOCK` qualifier allows a selected record to be locked for updating, which will be important for result processing.  Results can be retrieved using a different approach than the standard `SELECT` command, which knows nothing about calculated results.  Instead, `RESULT_VALUE` and `RESULT_STRING` should be used for single result retrival:

```
JOIN LIBRARY $lib_utils
sample_id = 3
analysis_id = "SUGAR_CONT/2"
component_name = "Fructose"
FLASH_MESSAGE( RESULT_STRING(sample_id, analysis_id, component_name), TRUE) { 7 }
FLASH_MESSAGE( RESULT_VALUE(sample_id, analysis_id, component_name), TRUE) { 7.000 }
```

In the above example, if a matching result isn't found, `EMPTY` is returned.

To retrieve all results for a given test use the `GET_TEST_RESULTS` command with a supplied `test_id`, a 2D array containing a "header" row, which will be filled in with additional rows of actual results, and a "check variable" to contain a status indicator after retrieval of the results (successful retrieval = `EMPTY`, an error message otherwise).

```
JOIN STANDARD_LIBRARY STD_ARRAY
JOIN LIBRARY $lib_utils
ARRAY test_results
test_results[1,1] = "component_name"
test_results[1,2] = "units"
test_results[1,3] = "text"
test_results[1,4] = "status"
sample_id = 3
test_id = SELECT test.test_number WHERE (sample = sample_id) AND (analysis = "SUGAR_CONT") AND (TEST_COUNT = 2)

GET_TEST_RESULTS test_id, test_results, chk

IF chk = EMPTY THEN
    result_count = size_of_array(test_results)
    msg = ""
    i = 1
    WHILE i <= result_count DO
        msg = msg : PAD(test_results[i,1], " ", 15) 
            : PAD(test_results[i,2], " ", 15) 
            : PAD(test_results[i,3], " ", 15) 
            : PAD(test_results[i,4], " ", 15) 
            : ASCII(13) : ASCII(10)
        i = i + 1
    ENDWHILE 

    FLASH_MESSAGE(msg, TRUE)
ELSE
    FLASH_MESSAGE(chk, TRUE)
ENDIF
```


## Output

Infomaker reports are defined in .pbl files, usually stored in the "Imprint" folder.  The database records are in `INFOMAKER_LINK` and `INFOMAKER_PARAMTERS`.  They can be run directly from contextual menus, but can also be utilized via Master Menu Items (and subsequently via VGL `MENUPROC 15291 USING "report", "property"` calls, where 15291 is the ID of the "Run Management Report" master menu item).

Text-based reports can be programatically generated within VGL using the `LITERAL ... $ENDLITERAL` functionality.  Text between these two keywords is output literally, except for indicators starting with the `$` character, which is assumed to be a variable name, to be replaced with that variable's value.  Replaced values are padded or truncated to occupy the same number of spaces as the variable name.  The variable name underscore "tricks" inherent to the VGL language can therefore be used to easily force desired padding:

```
LITERAL
Sample Id:    $sample_id_________
Status:       $sample_status_____
Modified On:  $sample_modified_on
$ENDLITERAL
```

Literals can contain only variable replacements, not arbitrary code blocks, so loops and branching must contain the literals instead:

```
WHILE i <= size_of_array(test_results) DO
    LITERAL
        $test_results____[1]   $test_results______[2] $test_results[3]
    $ENDLITERAL
ENDWHILE
```

New pages can be forced in output using the `NEW PAGE` command, and repeated page headers can be defined using the `ON NEW PAGE ... ENDON` construct:

```
ON NEW PAGE
LITERAL
    This is literally a text-based report, made in 1982.
    Sample ID            Test Count            Status
    _________            __________            ______
$ENDLITERAL
ENDON
```

Report headers and footers are defined using `SET HEADER expr` and `SET FOOTER expr` where `expr` is a valid VGL expression.  If `##` appears in the text expression, it will be replaced with current page number, e.g. `SET FOOTER "PAGE ##"`.

Page dimensions are defined using `SET WIDTH x` and `SET LENGTH y` where `x` and `y` are column and line counts (80 columns and 61 lines by default).  US Letter sized pages should be set to 57 lines.  New pages can be avoided by using `TEST PAGE n` where a new page will be started unless the lines remaining on the page is less than `n`.  The lines remaining on the current page can also be determined using the `LINESLEFT` command:  `lines_remaining = LINESLEFT`.  

The `SET NAME` command determines the output destination of a report:

- `SET NAME "DISPLAY/"` sends output to the screen
- `SET NAME "DEFER/"` prompts user for destination
- `SET NAME "filename"` sends output to file, named as specified
- `SET NAME "PRINTER/prt_id/"` sends output to specified printer
- `SET NAME "LOCAL/"` sends output to a local printer
- `SET NAME "MAIL/name"` sends output to email addresses separated by commas
- `SET NAME "EDIT/"` sends output to text editor

To complete a report, the `FLUSH_LITERAL` command can be used, which completes the output by prompting for a destination.

Printer code commands can be included in output by using `SET PRINTERCODES TRUE` and prefixing printer commands with the `!` character, which are used to toggle their change on and off:  `!B` (bold), `!U` (underline), `!P` (proportional fonts), etc.  Drawing a line is accomplished with `!L` followed by line drawing command (see docs).  


## Writing to the Database

Before data can be written to the database, the `SET NOTPROTECTED` command must be used (to essentially remove the "write protection").  If this command is left out, an error message will state "This format must be called from a specific menu procedure".

Before data can be updated, it must be selected, and it must be selecting using the `FOR UPDATE` qualifier (in a `SELECT` command or in a `PROMPT` creation).  The `FOR UPDATE` qualifier locks the database record until a `COMMIT` or `ROLLBACK` is submitted (which also unlock any records locked by `FOR UPDATE` qualifiers).

A write transaction is started using `START WRITE TRANSACTION "tx_name"` and ended with either a `COMMIT` or `ROLLBACK` command.  A `PROMPT` command must never be placed within a write transaction because it may automatically perform `ROLLBACK` or other commands.

Field values are set in-memory using the `ASSIGN table.field = value` syntax. The change is written to the database via the `UPDATE table` command, and committed via the `COMMIT` command. A check variable can be added, i.e. `COMMIT, chk` to verify that the commit was successful (`chk = EMPTY`).

Here is a complete update example:

```
SET NOTPROTECTED
START READ TRANSACTION "find customer"
SELECT customer.identity FOR UPDATE WHERE identity = "PEDRO" 
ASSIGN customer.web_page = "https://google.com"
START WRITE TRANSACTION "modifying cust web page"
UPDATE customer
COMMIT
```

To insert a new record, space must be reserved in-memory using `RESERVE ENTRY table, id` within a write transaction (docs incorrectly state "read" transaction):

```
SET NOTPROTECTED
START WRITE TRANSACTION "making a customer"
RESERVE ENTRY customer, "DELETEME"
UPDATE customer
COMMIT
```

The command can also specify a record to copy non-ID fields from as well: 

```
SET NOTPROTECTED
START WRITE TRANSACTION "making a customer"
RESERVE ENTRY customer, "DELETEME" COPY_FROM "PEDRO"
UPDATE customer
COMMIT
```

The `DELETE` command deletes the currently pointed record.  When the pointed-to record in-memory is deleted, no result set is accessible, so a new `SELECT` command may be required.

```
SET NOTPROTECTED
START READ TRANSACTION "getting a customer"
cust_to_delete = SELECT customer.identity FOR UPDATE WHERE identity = "DELETEME"
START WRITE TRANSACTION "deleting customer"
DELETE customer
COMMIT 
```

Creation of new jobs/samples/tests/results is best handled with specialized functions rather than direct record insertion as in examples above.  These specialized functions do not need explicit transaction handling because they handle it on their own.  Only a `SET NOTPROTECTED` command is required.  To create a new job, use `new_job_name = NEWJOB(job_template_ID, job_name)`, leaving either/both paramters blank if the user is to be prompted for the template, or the name is generated by the template.

```
JOIN LIBRARY $lib_utils
SET NOTPROTECTED
new_name = NEWJOB("DEFAULT", "")
FLASH_MESSAGE(new_name, TRUE)
```

Similarly, a new sample can be created with `NEWSAMPLE(job_name, samp_template_id, syntax_id)`, where `job_name` is blank if a sample is meant to be logged in without a parent job, `samp_template_id` is the identity of the sample template to be used, and `syntax_id` is the identity of the syntax to be used for name generation (if left blank, sample will be named after template plus a number, and if specified template uses a syntax, it will be used without regard to any value supplied for `syntax_id`):

```
JOIN LIBRARY $lib_utils
SET NOTPROTECTED
new_id_numeric = NEWSAMPLE("", "NOINPUT", "")
FLASH_MESSAGE(new_id_numeric, TRUE)
```

Tests are created using `test_number = NEWTEST(sample_id, analysis_id)`.  A valid `sample_id` must be supplied:  the sample must not be in status `A`, `R`, or `X`.  

```
JOIN LIBRARY $lib_utils
SET NOTPROTECTED
new_test_number1 = NEWTEST(142, "MECHANICAL")
new_test_number2 = NEWTEST(142, "HARDNESS")
FLASH_MESSAGE(new_test_number1 : " and " : new_test_number2, TRUE)
```

Results are added using `result_check = NEWRESULT(sample_id, test_number, component_id, result, unit)` for single results. If a matching component exists for the given test, the result record is updated, otherwise a result record is created.  In the case of a new record, if the component is not listed in the given analysis, then an ad-hoc result is created.  In the case of an ad-hoc result, if the given result value can be converted to a numeric type, the result is created as a numeric type, otherwise it is created as a text result. The return value of `NEWRESULT` is `EMPTY` if successful, or an error message otherwise.  

```
JOIN LIBRARY $lib_utils
SET NOTPROTECTED
res = NEWRESULT("142", "60", "Shore A", "65.1", "")
IF res = EMPTY THEN
    FLASH_MESSAGE("Successfully added result", TRUE)
ELSE
    FLASH_MESSAGE(res, TRUE)
ENDIF
```

The `PUT_TEST_RESULTS test_number, results_array, status_array` command is used for multiple results.  Result fields must be stored in the first row of the array, and each result to be saved comprises an additional row in the array.  Component name must appear in the array, and the result type must also appear for any adhoc results.  Some fields cannot be included in the array:  `status`, `test_number`, `value`, `entered_on`, and `entered_by`.

```
SET NOTPROTECTED
ARRAY results
results[1,1] = "component_name"
results[1,2] = "text"
results[1,3] = "result_type"

i = 2
WHILE i <= 6 DO
    results[i, 1] = "Result " : NUMBER_TO_TEXT(i-1, "9")
    results[i, 2] = NUMBER_TO_TEXT(i, "9")
    results[i, 3] = "T"
    i = i + 1
ENDWHILE

PUT_TEST_RESULTS "59", results, status_array
```


## Internal Functions

VGL can access OS functionality via internal functions.  To start a server-side process, use `SPAWN expr1 expr2` where `expr1` is the OS command and `expr2` is `QUIETLY` (no input/output) or `NOWAIT` (user is not blocked while process is running).

The `GLOBAL` function returns configuration info, such as in `user_name = GLOBAL("mode")`, which returns `"INTERACTIVE"`, `"BATCH"`, or `"BACKGROUND"`.  Other string parameters that can be used with `GLOBAL()` include `"process_id"`, `"termtype"`, `"operator"`, and `"current_library"`.  Globals can be modified using `SET GLOBAL "globalname" TO "newvalue"`. 

Custom result calculations can be created in VGL.  Unlike "report" VGL code, they are stored in the server's calculations directory with a `.caf` extension.  The calculation functions get the sample numeric ID, the `test_number`, and the `component_name` passed in as paramters.  The function can then do arbitrary mathematic operations and data access to arrive at a value which is then returned in a `RETURN` statement by the function.  So a calculation function skeleton will look like this:

```
GLOBAL ROUTINE CALCULATION(sample_id, test_number, component_name)
    RETURN ()
ENDROUTINE
```

To read a result value from the database into a variable, the `RESULT_VALUE` global function can be used.  So a calculation to find the difference between two weights might look like:

```
GLOBAL ROUTINE CALCULATION(sample_id, test_number, component_name)
    wt1 = RESULT_VALUE(sample_id, test_number, "Weight Before")
    wt2 = RESULT_VALUE(sample_id, test_number, "Weight After")
    diff = wt1 - wt2
    RETURN (diff)
ENDROUTINE
```

To use a calculation in VGL code (outside of result calculations), simply use the `CALL_ROUTINE "calculation" IN LIBRARY_NAME USING param1, ..., paramN RETURNING return_value`.  Note that the name of the routine will always be `"calculation"`, only the `LIBRARY_NAME` will ever change.

Similar to calculation routines, significant figures filter routines allow proper formatting of result values. The signature is:

```
ROUTINE sig_figs_filter(VALUE sig_figs, { number of sig figs to be applied to filter }
                        VALUE rounding_base, { unit value for rounding figures }
                        VALUE decimal_places, { number of decimal places for result }
                        VALUE text_result, { input textual result }
                        VALUE numeric_result) { input numeric result }
    filtered_result = 0
    RETURN (filtered_result)
ENDROUTINE
```

When an item changes status, custom VGL programs can be automatically executed.    Before the status triggers will work, configuration items must be enabled:  `JOB_TRIGGER_ENABLE`, `RESULT_TRIGGER_ENABLE`, `SAMPLE_TRIGGER_ENABLE`, `TEST_TRIGGER_ENABLE`.  By default they are disabled for performance reasons.  Four built-in VGL programs facilitate the use of the status trigger feature:  `$SAMPSTAT`, `$JOBSTAT`, `$TESTSTAT`, `$RESLSTAT`.  These files provide the skeleton for custom status triggers, and are meant to be modified as required.  Each file contains routines for the various new statuses, e.g. `set_status_a`, `set_status_u`, `set_status_x`, etc.  The routines are not passed any values, but the applicable record is accessible via a select statement, e.g. `samp_id = SELECT sample.id_numeric`.  Code within the status trigger routines does not require `SET NOTPROTECTED` or `COMMIT` statements, as the calling context handles them.

