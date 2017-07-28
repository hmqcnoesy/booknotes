# SM Forms

Form info can be found in the `FORM` table in the database, and in .xml files the Exe\Forms directory, and compiled versions in the Exe\FormsBin directory (all server-side).  The .xml file is used by the form designer to open a form for editing, but saving in the form designer compiles the form into the .binform format in the Exe\FormsBin folder.

## Forms vs Property Sheets

Forms define a layout of controls, but do not specify a data source, i.e. a form is "unbound".

Property sheets are forms that are bound to a specific entity.

So a newly created entity will require a Property Sheet to be created in the Forms folder.

## Form Activation and Extension

A form can be tested using the right-click menu.  

Before a form can be used, it must be activated.  The activation process creates Master Menu Items (add, copy, modify, diplay, remove, restore) and a new Global Table Defaults record.  Among other roles, the Global Table Defaults record specifies which of the Master Menu Items are displayed by default when right-clicking in a folder or on an item.

Customizations to standard forms should be done through the "Extend" feature rather than editing the form directly.  Extending the form will prevent overwriting the form during an upgrade.  Extending forms is also useful to avoid experimental changes to an existing, working form.  Extending a form copies form data into a separate file for editing.


## Controls

The most common control on a form is the `Prompt` control.  This control has a property named `Property` that specifies the field to which it is bound.  A prompt control is comprised of an input type appropriate to the bound field's datatype, and a label that can set using the `Caption` property.  

The `DataGrid` control can be used to display/edit related entities that are linked in `structure.txt` using the `PARENT` keyword.  The grid has some strange editing behavior, such as allowing identities of records to be modified, so it is probably usually best to set the grid's `ShowButtons` to `False` and `ReadOnly` to `True`.

The `ExplorerGrid` control displays related entities, with explorer-style context menus available.  The grid's `Browse` property should be set to an instance of an `EntityBrowse` control.  The `EntityBrowse` control's `Entity` property (and/or `Property` property) can be set to the table required for the grid.  The `EntityBrowse` control's `Query` property can be set to an instance of the `Query` control if any filtering of the entities is required.

The `SelectionGrid` control shows checkboxes of many-to-many related entities.  For an example of creating many-to-many relationships in `structure.txt`, see `table sample_formulation`, although the `field` statements leave out the `parent` qualifier after `links_to`, which may be required for proper form functionality.  A selection grid's `Property` property should be set to the many-to-many joining table, and the `BrowseDataQuery` property should be set to an instance of a `Query` control, whose `EntityType` property should be set to the table name whose records are to be displayed.  The selection grid's `Columns` collection should also be specified.

The `MasterDetailGrid` control shows hierarchical relationships between linked entities. To use the control, set the `Property` property to the desired top-level entity, set the desired columns in the `Columns` collection property, then set the `DetailGrids` collection property to the collection of desired entities.  Set the `Columns` collection for each level needed.  If the desired top-level entity is not available for selection in a `Property` property, it probably didn't use the `parent` qualifier in the field definition (`field field_name links_to parent ...`).  Like the `ExplorerGrid`, the `MasterDetailGrid` should probably always have `ReadOnly` set to `True`.

A `TreeList` control is an alternative to the `MasterDetailGrid` control.  It cannot display multiple columns like the `MasterDetailGrid` can, but it can include contextual menus.  To use a `TreeList`, set the `Levels` property.  At each level, the `NodeDialog` property can be set to allow a custom form to be displayed when adding a new node.


## Forms as Explorer Views

A form entity can be changed to become an explorer view by setting its window style from `FLOAT` to `EXPLORER`.  Then the form can be applied to a folder, with the folder's "Task" set to "DefaultFormTask" to display directly in the explorer when that folder is selected.