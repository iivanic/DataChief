# DataChief
Flexible **Data Collection eForms Solution** with focus on **usability** and **simplicity** that actually **works in the real world**.

##What is it for?
DataChief enables you to **rapidly implement processes in your company/organization with no cost** - all you need is email account(minimal requirement). Used in a right way DataChief can save you tons of money and nerves. You can immediatly bring order into chaos, implement solution for your sales force in the field, track activities within company and/or implement managamenet systems like **ISO 9001(QM), ISO 14001(EMS), ISO 27001(ISMS), ISO 20001(SMS)/ITIL** with ease. 

You don't have to be blocked anymore by expensive Line of business (LOB) applications development that never ends, and when they are finally ready, they are often obsolete.

Take a look at **[Barrique Works LLC Case Study](./Case study Barrique Works LLC.md)**. 

##Roadmap
Project is under develpment. First release will provide basic functionality for designing forms, simple workflows, and collecting data.
* Multiplatform (developed in Electron)
    * Windows
    * Linux
    * Mac OSX
* Planned features
    * Visual and user friendly form designer '90%'
    * Many type of controls
        * Text box, ListBox, Group fields ...
        * Repeaters for table implementation
        * External Lists, data from web services
        * Images from camera
    * Flexible communication protocols through:
        * One STMP/IMAP email for whole organization or through individual Emails for every user
        * Single online folder (DropBox, Google drive, Onedrive, ...)
    * Mobile devices support for client app
        * offline / low signal support
    * Broadcasts workflow statuses
    * Ability to configure local cache - sensitive data can be prohibited to stay on client
    * Publishing & revoking of templates
    * Encryption support
    * Collection points and analytics
 
##Notes on mobile platforms
Smartphone versions are planned, and are crucial part of DataChief. For most part, this software is being developed on 200US$ 2-in-1 10" tablet, so until release of smartphone versions for your mobile needs you can use device(s) such as Asus Transformer Book T100, Acer Aspire Switch 10 or similar.
 
##How do I start with DataChief source code or test new version before release?
* You will need **Node.js**, **Git** and **Microsoft Visual Studio Code** already installed.
* From command line:
    * pull source code from GitHub:
    
        `git clone https://www.github.com/iivanic/datachief.git`
    * go to project root: 
    
        `cd datachief/`
    * install electron-prebuild - it is not included: 
    
        `npm install electron-prebuilt@0.37.8 --save-dev`
    * install node-imap: 
    
        `npm install imap`
    * install electron-window-state: 
    
        `npm install electron-window-state`
        
    * now You can open it with **Microsoft Visual Studio Code**. Depending on the platform You may also need to change **"runtimeExecutable"** line in lanch.json. For **Windows**: "**${workspaceRoot}/node_modules/.bin/electron.cmd**", for **Linux**: "**${workspaceRoot}/node_modules/.bin/electron**" and for **Mac OSX** use "**${workspaceRoot}/node_modules/electron-prebuilt/dist/electron.app/Contents/MacOS/Electron**"
    * press **F5** to run DataChief
    
##How does it work?
DataChief is simpe solution that allows you to **define your forms, publish and collect them**. It runs as simple to install desktop app (Mobile version is planned) on multiple platforms (Windows, MacOSX, Linux). DataChief requires no additional network services except IMAP (Email) account(one for all users or one per user).
![DataChief simple workflow](/dc_workflow.png)

###Users
In DataChief users are identified with **Emails**. Even if you are using DataChief in "Single User Account" mode, you will still need to set Email for every user becouse email identifies the user, but in this mode those emails does not have to exists.

###Communication
Communication between user is made via IMAP account(s). DataChief can use existing Email accounts and accounts can be used in parallel with user, non-datachief emails. Imap fodler called "datachief" will be created and datachief will not touch enything outside that folder. There are two operating modes:
* **Single user account** - All users communicate only through one account. This is preferable when testing or with simple deployments. Drawback is lowered security. In the future, there is possibility to implement Network storage services such as DropBox, Google drive, One Drive, etc. Implementation of these features depends on user interest.
* **Per user account** - This is preferable when dealing with sensitive data. Every DataChief installation has its own IMAP account.

###Forms
DataChief allows you to define your data sets with custom forms designed in provided **Form Editor**. Multiple types of controls are available, including repeater groups to allow you to implement data that is on paper forms usualy defined as table.

###Workflow
* Following Form properties helps define workflow
    * Workflow - this property **defines workflow** for the form
    * Broadcast recievers - this is list of users that are notified when form moves from one user to another. Think of those users as monitors.
    * Final step - this is one or more user(s) that collects the data. DataChief is not designed as database for millions of forms, so those users should periodacally export collected data as Text files, SpreadSheets or Databases.
    * Publish To - this property defines who cas start empty form. 
     
     All properties can have multiple users. Users are defined as emails delimited with delimiters.
     Delimiters between emails are , or ;

     Workflow property is most complex.   
     in workflow, every email represents one step, but, if in brackets, then user can choose one of the emails within brackets when sending to that step.
     For example, let's say Worflow is: 
     * user1@example.com; user2@example.com; (igor@example.com; User3@example.com, User4@example.com); userA@example.com

     this means that workflow will be user1@example.com -> user2@example.com -> 
     and the user2@example.com, when sending to next step, will be prompted to choose one of three options (igor@example.com; User3@example.com, User4@example.com).
     if, user2@example.com chooses igor@example.com, igor@example.com will be aple to send form to userA@example.com
    
     Another option is integer after ending bracket, for instance, let's say Worflow is:
     * user1@example.com; user2@example.com; (igor@example.com; User3@example.com, User4@example.com)5; userA@example.com
     
     This means that users within 3rd step (igor@example.com; User3@example.com, User4@example.com) can 5 times send the form between
     themselves, or to next step (prompt will be shown).
     This is usefull when you don't know how exactly form in that step needs to be resolved (for instace ISO 9001:2015 preventive/corrective action)
     Sometimes users need to have freedom to choose recipients, but number of sending is limited, so that form will always find it's way
     to final step.

###Status broadcasts
* Defined with "Broadcast recievers" property in worflow part of form, it is a list of users that are notified when form moves from one user to another. This is usefull for tracking organization activities and overall health of the system.

###Data collection & export
* Data collectors are users specified in "Final step" property of the form.
* They recieve form and can see recieved forms as table, and then export and/or delete form data
* Supported export options are 
    * MS Excel or Open Office formats
    * XML
    * Relational database as SQL (ANSI SQL compatible Databases such as MS SQL Server, Oracle, My SQL, PostrgreSQL, MS Access, ...)

##DataChief security
* DataChief has Built in secret (symmetric key) and everything it does is encrypted with it – easily cracked since source code is avalaible
* Organization secret – if set, this is used(together with DataChief built in secret ) for encryprion of form templates when publishing. It ensures identity of publisher. DataCheif sends digest of this secret within every package. First time user recieve Package she or he can approve or disapprove publisher by accepting/refusing this digest. If publisher later changes Organization secret, user will be again prompted wheather she or he accepts digest(publisher). Before accepting, user should confirm with publisher that change of Organization secret is really happening and that this is not case of malicious attack.
* User secret in Single account mode – in this mode messages share single IMAP account, so to make sure that one user can not read others messages, they are encrypted with User Secret. This means that all users must be defined in Designer/Publisher with user secrets. Specific user secret must be set on each individual DataChief Filler installation.

##DataChief Communction is made via Packages
* Package is zero or more forms and commands.
* Package is  always created per user who recieves them.
* User(s) who recieve package(s) must accept Organization secret digest. If publisher later changes Organization secret, user will be again prompted wheather she or he accepts digest(publisher). Before accepting, user should confirm with publisher that change of Organization secret is really happening and that this is not case of malicious attack.
* When publishing, Package for user will DELETE ALL PREVIOUSLY PUBLISHED FORMS. This means that publisher must always publish all active forms.
* If you want to revoke user, You can create empty package for that user
* Commands are:
    * Delete all local copies from publisher - deletes every filled or half filled form(sent forms folder, outbox folder, work folder, recieved folder) from that publisher. This can be usefull when employee is leaving organization or organization internal security policy changes.
    * Send text message – sends text message that will be displayed to user.