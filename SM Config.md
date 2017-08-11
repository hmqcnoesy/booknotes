# SM Config

Sample Manager data are labeled as one of the following types:

- Dynamic: relating directly to laboratory work, i.e. Samples, Tests, Results, Jobs, Batches.
- Active: Current dynamic data, of immediate interest.  Can be committed to maintain database efficiency.
- Committed: Data that were once active, but now read-only, in a segregated tablespace for performance reasons.  Data are of historical interest only.  Can be "deconsigned" to return to active if needed.
- Static: rarely changed (non-dynamic) data that defines the Sample Manager environment.

Logging in of dynamic data is accomplished via templates and workflows.

- Sample login templates are the legacy solution to logging in (pre version 11).  Test assignment using templates is via Test Schedules.
- Entity Templates for Samples, Jobs, and Tests define prompts for relevant information when used in conjunction with workflows.
- Login Workflows allow for login of Samples or Jobs containing Samples.  Each workflow specifies an entity template to be used for assigning and/or prompting for information.
- Other workflow types besides Login Workflows include Method Workflows, Entity Workflows, General Workflows, and Lifecycle Workflows.

When a Sample is logged in, child tests are created based on an Analysis, which is a static data item defining test information.  An Analysis must define one or more Components, which become the Result records of a Test at login.  An analysis may also define one or more Component Lists, which are subsets of the full list of components.  An analysis may also define Analysis Matrices, which are multiple entires for individual components.  For instance, in a GC analysis, a Component may be "Toluene", but there may be a requirement to record the GC retention time and the peak height and peak area as part of that result.  An Analysis Matrix allows such additional info to be stored against individual results.  Lists of tests can be created to allow easy login of associated tests, through Test Schedules. 

Related Samples can be grouped together under Jobs.  The meaning of a Job is dependent on the particulars of a laboratory.

Samples may also have parent/child relationships with other samples, via the splitting and pooling features in Sample Manager.  


## Status

All records in the dynamic data hierarchy (Jobs/Samples/Tests/Results) have a Status column.  A default lifecycle is defined in Sample Manager, but it is possible to define a custom status lifecycle if needed.  Here is a summary of statuses:

| Status         | Job | Sample | Test | Result | Color |
|----------------|-----|--------|------|--------|-------|
| Unavailable    |     | U      | U    | U (unentered) | Gray |
| Waiting prep   |     | W      | W    |        | Gray |
| Hold           |     | H      |      |        | Light Blue |
| Available      | V   | V      | V    |        | Green |
| In Progress    |     |        | P    |        | Yellow |
| Entered        |     |        |      | E      | Dark Blue |
| Completed      | C   | C      | C    |        | Dark Blue |
| Modified       |     |        |      | M      | Modified |
| Inspection     |     | I      | I    |        | White |
| Authorized     | A   | A      | A    | A      | Red/Green |
| Suspended      | S   | S      | S    |        | Gray |
| Rejected       | R   | R      | R    | R      | Orange |
| Cancelled      | X   | X      | X    | X      | Orange |

Inspections are an optional status, but a rejected status on a sample can be set only from an Inspection status, whereas Authorized can be set from Completed or Inspection.  Results can go from entered/modified directly to Rejected or Authorized.

In general, the status of an item is depedent on status of descendant items, e.g. a Job is completed when all its Samples are completed and each Sample is completed when all its Tests are completed.  Similarly, a status can propogate down to descendants, e.g. Samples are completed (or authorized) when parent Jobs are completed (or authorized).

Sample status at login can be `H`, `U`, or `V`, depending on workflow parameters, or `W` by assigning the status value via an Entity Template.

An Inspection Plan lists operators that must inspect an item (Sample, Test, Incident, Analysis, MLP, Entity Template, Login Workflow, Workflow, or Sample Plan).  An Inspection Plan can be marked as "linear" or "round robin" and must list all operators who should perform an inspection (although a System access user can carry out inspections on behalf of other users). An Inspection Plan can be assigned to a sample via an entity template, then a sample is submitted for inspection after reaching a `C` status via the contextual menu option "Process" > "Submit for Inspection".  When an inspection fails, the item is set to `R` status, and all remaining inspection plan operators' records are cancelled.


## Scheduling

Login Schedules are static data items that specify dynamic data to be logged in at specified intervals.  They allow templates to be specified, but not workflows.  The scheduling is done through the "Activate" option of a Login Schedule (via contextual menu), where start times and repeat intervals can be set.

VGL programs ("Reports") can be scheduled for background execution, via the contextual menu item "Schedule Report".  

The Watch Dog Timer executes all Login Schedules and VGL Background Reports.  The Timer Queue (Setup \ Scheduling \ Watch Dog Timer \ List Entries) lists all upcoming events that the Watch Dog Timer will be responsible for.

A Schedule defines when samples should be collected for testing from sample points.  For instance, a Schedule could login samples (interactively or in background) for one sample point every morning at a certain time, then for another sample point every evening at a certain time.  Schedule Groups can be created to manage similar schedules together.  Schedule records are normally handled by the Watch Dog Timer, but can also be manually triggered via the Schedule item's contextual menu.

A Schedule Calendar is a static data item that defines holidays or other planned downtime.  A Schedule record can be associated with a Schedule Calendar to automatically skip executions that would otherwise occur.


### Incidents

An Incident (think of as a corrective action) is a dynamic data item in the sense that it has a defined lifecycle and status values with defined legal status transitions.  Incidents can be created manually or automatically when result entries are cout of spec (via MLP).  An incident may require checklist items and/or an inspection.


### Stocks

Stocks represent laboratory resources and consumables such as reagents, instrument parts, and disposable containers.  A `STOCK` record represents the information to be tracked for stocks, and a `STOCK_BATCH` record represents actual, physical stocks in the lab.  Stock batches can be created directly, or via creation of a Stock Order, which, when received, will create a corresponding batch.  Inventory amounts can be tracked by listing stock consumption values in an Analysis.

Stock Batches can be assigned to locations.  Stock Batches can be moved, split, reconciled, and consumed as needed.  As changes to Stock Batches' amounts are made, Stock Inventory records are automatically created.


### Preparations

A Preparation represents a laboratory process that is important to sample and test processing.  A preparation can set a "Wait for Preparation" flag, which will set associated samples/tests to status `W`.  The contextual menu option "Process" > "Complete Preparation" moves these sample/test items to `V` status, where they continue on the normal status lifecycle.


### Standards

Standards can be blanks (contain none of the analyte in question), calibration standards (contain some known concentration of the analyte), or control standards (a genuine sample having a known concentration of the analyte, to be used for QC purposes).  In Sample Manager, standards are static data items stored in the `STANDARD` table.  Standard Versions can be created from Standards.  Standard Versions can have an active or expired status.  


### Worksheets

Worksheets aggregate samples and optionally standards for ordering/assigning lab work to be done.  There are 4 types of worksheets in Sample Manager:

- *Analysis* - allows aggregation of samples with same analysis; may include standards.
- *Sample* - details analyses required for a particular sample.
- *Sample Preparation* - allows aggregation of samples with the same assigned Preparation.
- *Test Preparation* - allows aggregation of tests with the same assigned Preparation.

One of the 4 types of worksheet can be generated in Sample Manager using the "Worksheets" menu.  After generating a worksheet, a report can be printed, or a text file can be output for instrumentation software, etc.  Result entry can be done per-worksheet instead of finding each applicable sample for result entry.


### Batches

Batches are like worksheets in the sense that they are a means of grouping work that is related in some way.  A Batch is like an Analysis Worksheet but with more capabilities, allowing QA and QC operations.  A Batch is created based on a particular Analysis and a Batch Template.


### Lots

Lot Templates can login Lots, which are dynamic data associating raw materials together for tracking of sample / end-product origin, history, and relationships.