# SM Forms with C#

When a new form is created in Sample Manager, the XML file is created in the server's Exe\Forms directory.  If an existing form is edited in the designer, its XML file is modified in-place, but if it is modified using the "Extend" feature, a companion XML file is created in the server's Exe\Forms\Overlay directory.  Extended files will have the same filename as their corresponding original file in Exe\Forms.  Import/export of extended forms is as simple as copying this file from the source instance's Overlay directory to the target instance's Overlay directory.

Sample Manager can be connected to via local and remote modes.  Development is done in local mode for easier debugging, but users will connect via remote mode, where things like `MessageBox.Show()` will not work.  So it is important to test periodically in remote mode to ensure proper functionality.  Sample Manager provides libraries to handle its unique server/client setup, such as `Library.Utils.FlashMessage()` instead of `MessageBox.Show()`.  This is required by the custom form code runs on the server but must all be presented on the client.  Sample Manager transmits form data via XML over TCP at runtime.

Projects in Visual Studio for customization must have references to the following assemblies:

- Thermo.Framework.Core (Exe)
- Thermo.Framework.Server (Exe)
- Thermo.SampleManager.Common (Exe)
- Thermo.SampleManager.Library (Exe)
- Thermo.SampleManager.ObjectModel (Exe\SolutionAssemblies)
- Thermo.SampleManager.Tasks (Exe\SolutionAssemblies)
- Thermo.SampleManager.Tasks.EntityDefinition (Exe\SolutionAssemblies)
- Thermo.SampleManager.Tasks.FormDefinition (Exe\SolutionAssemblies)


## Simple forms

After creating a simple form in Sample Manager, open the Customization.sln in the server's "Solution\Customization" directory.  The solution contains a `CustomizationObjectModel` project and a `CustomizationTasks` project.  A custom task can be added as a class to the `CustomizationTasks` project.  The class should be made `public`, should inherit from `Thermo.SampleManager.Library.SampleManagerTask` and should be decorated with `[Thermo.SampleManager.Library.SampleManagerTask("AFC_SimpleForm")] where `"FormName"` is the name of the form in the database record:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Thermo.SampleManager.Library;
using Thermo.SampleManager.Library.FormDefinition;
using Thermo.SampleManager.Library.ClientControls;

namespace Customization.Tasks
{
    [SampleManagerTask("AFC_SimpleForm")]
    public class AFC_SimpleForm : SampleManagerTask
    {
    }
}
```

When a form is created in the Sample Manager interface, code in the server's `Exe\SolutionAssemblies\Thermo.SampleManager.Tasks.FormDefinition` is regenerated to include a class with the same name, prefixed with "Form", e.g. `FormAFC_SimpleForm`.  This class is used to interact with the form itself, so a reference to it is necessary.  Custom code is executable by overriding the `SetupTask()` method of the `SampleManagerTask` class:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Thermo.SampleManager.Library;
using Thermo.SampleManager.Library.FormDefinition;
using Thermo.SampleManager.Library.ClientControls;

namespace Customization.Tasks
{
    [SampleManagerTask("AFC_SimpleForm")]
    public class AFC_SimpleForm : SampleManagerTask
    {
        private FormAFC_SimpleForm _form;
        
        protected override void SetupTask()
        {
            _form = FormFactory.CreateForm(typeof(FormAFC_SimpleForm)) as FormAFC_SimpleForm;
            _form.Loaded += FormLoaded;
            _form.Show();
        }


        void FormLoaded(object sender, EventArgs e)
        {
            _form.btnSayHello.Click += ButtonClicked;
        }


        private void ButtonClicked(object sender, EventArgs e)
        {
            Library.Utils.FlashMessage("Hello from a C# task", "Task");
        }
    }
}
```

Note that the form above was created using a factory method and the form is displayed by calling the `Show()` method.  This is because the class inherits from `SampleManagerTask`, but a class can inherit from `DefaultFormTask` or `GenericLabtableTask` (which both in turn inherit from `SampleManagerTask`).  The `DefaultFormTask` class creates and opens a form using context info from the Explorer or main menu.  The `GenericLabtableTask` provides standard functionality for static data (Add, Modify, Print, Copy, etc.).  Objects that inherit from `DefaultFormTask` or `GenericLabtableTask` will be shown automatically by the client, and the form itself is accessible via a `MainForm` property.  When a form is created, regardless of the inheritance, the form is opened at the server, then the client draws the form window, then the `FormCreated` event is raised on the server, then each of the controls are created on the client, and lastly the `FormLoaded` event is raised on the server.  The `DefaultFormTask` and `GenericLabtableTask` both have virtual methods that can be overridden to handle events:  `MainFormCreated()` and `MainFormLoaded()` (make sure to keep a call to `base.MainFormCreated()` or `base.MainFormLoaded()`).

To make a customization available to Sample Manager, the dll must be added to the `SampleManagerServerHost.Exe.Config` file in the server's Exe directory, or in the case of local mode, the `SampleManager.Exe.Config` file (also server-side).  This addition should be done in the `<customization><assemblies>` section, e.g.

```
<customization>
    <assemblies>
        <assembly name="Thermo.SampleManager.Tasks.FormDefinition" />
        <assembly name="Thermo.SampleManager.Tasks.EntityDefinition" />
        <assembly name="Thermo.SampleManager.Tasks" />
        <assembly name="Thermo.SampleManager.ObjectModel" />
        <assembly name="Customization.Tasks" />
        <assembly name="Customization.ObjectModel" />
```

The compiled dlls should be saved in the server's Exe\SolutionAssemblies directory.  A post-build event in the Visual Studio project can take care of moving files:

```shell
xcopy /Q /Y "$(TargetPath)" "C:\Thermo\SampleManager\Server\<ENVNAME>\Exe\SolutionAssemblies"
```


## Extending an existing entity

An existing entity can be extended, and the custom properties can be included on that entity's form.  To do this, create a public class and decorate it with the `Thermo.SampleManager.Common.Data.SampleManagerEntity("ENTITYNAME")` attribute, where `"ENTITYNAME"` is the name of the entity to be extended.  The class should inherit from the entity type it is extending also.  For instance:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Thermo.SampleManager.Common.Data;
using Thermo.SampleManager.ObjectModel;

namespace Customization.ObjectModel
{
    [SampleManagerEntity("CUSTOMER")]
    public class ExtendedCustomer : Customer
    {
        [PromptText]
        public string ContactDetails
        {
            get
            {
                return CompanyName + Environment.NewLine
                     + Email + Environment.NewLine
                     + Contact + Environment.NewLine
                     + PhoneNum + Environment.NewLine;
            }
        }


        [PromptText]
        public string AddressDetails
        {
            get
            {
                return CompanyName + Environment.NewLine
                    + Address1 + " "
                    + Address2 + Environment.NewLine
                    + Address3 + Environment.NewLine
                    + Address4 + Environment.NewLine
                    + ((Address5.Length != 0) ? (Address5 + Environment.NewLine) : (string.Empty))
                    + Address6 + Environment.NewLine;
            }
        }
    }
}
```

After implementing the above customization by deploying the compiled dll to `Exe\SolutionAssemblies` and modifying `Exe\SampleManagerServerHost.Exe.Config`, the "Customer" form can be extended in the Sample Manager designer, and `Prompt` controls can be added to the form with their `Property` properties set to `ContactDetails` and `AddressDetails`.

The two examples above illustrate the two common ways to customize forms with C#:  server tasks and entity extensions.  Server tasks are used to launch forms and/or execute custom code when launched, via master menu options.  Entity extensions are used to extend the built-in entities of the Sample Manager object model, and for the most part just add properties or methods.


## Extending an existing form

To add functionality to an existing form, extend the form and add controls in Sample Manager and save.  Create a class decorated with `[SampleManagerTask("TaskName", "LABTABLE", "ENTITYNAME")]` where `"TaskName"` is the name of the task you will create in Sample Manager, `"LABTABLE"` is a descriptor for how the form will be used, and `"ENTITYNAME"` is the database table name being extended (e.g. `"HAZARD"`).  For example, after extending the Hazard form with a new tab containing a button named `btnClickMe`, a class might look like:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Thermo.SampleManager.Library;
using Thermo.SampleManager.Library.FormDefinition;
using Thermo.SampleManager.ObjectModel;
using Thermo.SampleManager.Tasks;

namespace MattCustomForms
{
    [SampleManagerTask("AFC_HazardInfo", "LABTABLE", "HAZARD")]
    public class AFC_HazardInfo : GenericLabtableTask
    {
        private FormHazard _form;

        protected override void MainFormCreated()
        {
            _form = (FormHazard)MainForm;
            _form.btnClickMe.Click += ClickedButton;
            base.MainFormCreated();
        }

        void ClickedButton(object sender, EventArgs e)
        {
            var desc = (_form.Entity as Hazard).Description;
            var name = (_form.Entity as Hazard).Name;
            Library.Utils.FlashMessage(desc, name);
        }
    }
}
```

After deploying this compiled dll and modifying the config file to load the customization, testing on the hazard form should work, as long as `AFC_HazardInfo` is selected as the Server Task.  To make the change "permanent", modify the master item(s) - for example, modify the "Modify Hazard" master menu item, changing the Server Task to `AFC_HazardInfo` on the Implementation tab.  Note that the ".Net" option on a master menu item's Implementation tab is for internal operations only.

