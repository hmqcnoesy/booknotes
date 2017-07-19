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


## Variables, Constants, Arrays

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

Arrays use the keyword and optional specified sizing.  

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


## Operators, Functions, and Types

The text concatenation operator is `:` (there's also a `#` text subtraction operator):

```
oper_name = "jane"
msg = "hello, " : oper_name
{ msg is "hello, jane" }
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
- Special: types such as `EMPTY` which is implicitly returned from a routine using an empty `RETURN` statement


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

The `CHOOSE OUTOF array_name` keywords can be used to specify dropdown menu choices for the prompt:

```
JOIN LIBRARY $lib_utils
JOIN STANDARD_LIBRARY STD_PROMPT
SET COMPILE_OPTION DECLARE
DECLARE my_prompt
ARRAY date_choices
date_choices[1] = "Yesterday"
date_choices[2] = "Today"
date_choices[3] = "Tomorrow"
PROMPT OBJECT my_prompt
    AT 6.2, 6.5
    CHOOSE OUTOF date_choices
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
- `BROWSE ON SAMPLE_TEST`: Prompts for analyses assigned to the sample specified in `sample_id` property
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

As shown in the example above, a list is a type of a prompt object.  The object has properties, actions, and callbacks specific to the `PROMPT_LIST_CLASS` type.  For instance, a callback can be set for `double_click_routine`:  

```
the_list.double_click_routine = "sample_details"
ROUTINE sample_details(prompt_object)
    DECLARE selected_item
    prompt_object.get_first_selected(selected_item)
    FLASH_MESSAGE("You selected: " : selected_item, TRUE)
ENDROUTINE
```

A list can be styled by settings its integer `style` property.  The default value is `LIST_STYLE_REPORT + LIST_STYLE_SHOW_SEL_ALWAYS + LIST_STYLE_HEADER_DRAG_DROP + LIST_STYLE_FULL_ROW_SELECT`.  Thanks to the integral nature of the style constants, additional settings can be applied by adding or subtracting the constant value from the style property, e.g. `the_list.style = the_list.style + LIST_STYLE_GRID_LINES`.  Additional style constants include:

- LIST_STYLE_ALIGN_LEFT (icons at left)
- LIST_STYLE_ALIGN_TOP (icons at top)
- LIST_STYLE_NO_COLUMN_HEADER
- LIST_STYLE_NO_SCROLL
- LIST_STYLE_NO_SORT_HEADER
- LIST_STYLE_ONE_CLICK_ACTIVATE
- LIST_STYLE_TWO_CLICK_ACTIVATE ("normal" behavior)
- LIST_STYLE_SINGLE_SEL (disables multi-select behavior)
- LIST_STYLE_SORT_ASCENDING (initial display is sorted by label text)
- LIST_STYLE_SORT_DESCENDING (initial display is sorted in desc order)

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

