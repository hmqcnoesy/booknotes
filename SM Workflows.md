# SM Workflows

Sample Manager can automatically start documentation for a workflow, via contextual menu on the workflow, which opens a word document with info about the workflow.

A workflow can be exported via a contextual menu item to CSV and the Table Loader functionality can be used to import the CSV in another instance.

The Workflow Spy utility allows capturing logs of executing workflows for use in debugging. The utility is available on a workflow via the contextual menu.  Select it once to start, then execute the workflow, then run it again to see the trace.  The Test Harness, also via the contextual menu, allows interactive execution of a workflow, with more of a runtime debugging funtionality.

A dynamic data workflow can be used for either login or lifecycle management.  A login workflow will have a node for each item to be created, and the item will specify among other info a lifecycle workflow to be used for the item.  

An Analysis can assign a Method Workflow which can contain events for the test created by the Analysis.

Any given sample must be associated with a sample login workflow and a lifecycle workflow.  A sample might be associated with a job login workflow and/or a sub-sample workflow.  A sample might also be associated with method workflow(s), depending on child tests.

A generic workflow can be applied to an item on-demand by prompting the user for the item(s).

An extended lifecycle workflow can be "placed in between" a login workflow and its associated lifecycle workflow.