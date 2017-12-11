# DataChief
Flexible **Data Collection eForms Solution** with focus on **usability** and **simplicity** that actually **works in the real world**.

## What is it for?
DataChief enables you to **rapidly implement processes in your company/organization with no cost** - all you need is email account(minimal requirement). Used in a right way DataChief can save you tons of money and nerves. You can immediatly bring order into chaos, implement solution for your sales force in the field, track activities within company and/or implement managamenet systems like **ISO 9001(QM), ISO 14001(EMS), ISO 27001(ISMS), ISO 20001(SMS)/ITIL** with ease. 

## Features & Roadmap
Project is under development. First release will provide basic functionality for designing forms, simple workflows, and collecting data.
* Multiplatform (developed in Electron)
    * Windows
    * Linux
    * Mac OSX
* Planned features
    * Visual and user friendly form designer
    * Many type of controls
        * Text box, ListBox, Group fields ...
        * Repeaters for table implementation
    * Flexible communication protocols through:
        * One STMP/IMAP email for whole organization or through individual Emails for every user
    * Offline / low signal support
    * Broadcasts workflow statuses
    * Ability to configure local cache - sensitive data can be prohibited to stay on client
    * Publishing & revoking of templates
    * Encryption support
    * Collection points and analytics
 
## How do I start with DataChief source code or test new version before release?
* You will need **Node.js**, **Git** and, optionally, **Microsoft Visual Studio Code** already installed.
* From command line:
    * pull source code from GitHub:
    
        `git clone https://www.github.com/iivanic/datachief.git`
    * go to project root: 
    
        `cd datachief/`
    * install electron-prebuild, node-imap, ...  - they are not included: 
    
        `npm install` 
    * now You can start DataChief with
    
        * `npm start` 
        * or open it with **Microsoft Visual Studio Code** and press **F5** to run DataChief.
    * Make sure you choose "Enable Form Designer and Publisher (for Admins in your organization)" option in first step of configuration wizard so you can run tests(actual workflow simulation based on Case study) and design and publish forms. Choose "Client Only (typical choice)" option when installing Datachief for other users.
    * Make sure you install "Case Study users" in configuration wizard. They are also required for running tests.
        
* You can  use followingCommand line params:
    * `npm run start -- --runalltests`
        * deletes DB an runs all tests. Recommended for learning and using provided Case study. App wil axit after it's done and then start it with 
        `npm start`
    * `npm run start -- --runresetdb`
        * deletes DB
    * `npm run start -- --runtestcarlog`
        * runs test script for case study Vehicle usage form
    * `npm run start -- --testabsence`
        * runs test script for Absence request form
    * `npm run start -- --runtestqm`
        * runs test script for Quality Management form
    
## How does it work?
DataChief is simpe solution that allows you to **define your forms, publish and collect them**. It runs on multiple platforms (Windows, MacOSX, Linux). DataChief requires no additional network services except IMAP (Email) account - one for all users ( **Single user account** ) .
![DataChief simple workflow](/dc_workflow.png)

### Users
In DataChief users are identified with **Emails**, but  those emails does not have to exists, since we are using only one IMAP account for communication.

### Communication
Communication between user is made via IMAP account. DataChief can use existing Email accounts and accounts can be used in parallel with users, non-datachief emails. Imap fodler called "Datachief" will be created and datachief will not touch enything outside that folder. 

### Forms
DataChief allows you to define your data structure with custom forms designed in provided **Form Editor**. Multiple types of controls are available, including repeater groups to allow you to implement data that is on paper forms usualy defined as table with multiple empty rows.

### Workflow
* Following Form properties helps define workflow
    * Broadcast recievers - this is list of users that are notified when form moves from one user to another. Think of those users as monitors. Users can also, instead of emails be special address strings as
        * "**initiator**" - person who actually creates form
        * "**everyone**" - everyone in Workflow meanining everyone in "Publish To" +  "Workflow" + "Final Step"
        * "**stepN**" where N is Workflow index starting with 1. "step0" means "initiator".
    * Allow local copies - list of users that will keep sent copy of the form in theirs local folder. Can also be special address string 
        * "**everyone**"
    * Final step - this is one or more user(s) that collects the data. DataChief is not designed as database for millions of forms, so those users should periodacally export collected data as CSV file and delete Datachief DBs.
    * Publish To - this property defines who can start empty form. 
     All properties can have multiple users. Users are defined as emails delimited with delimiters.
     Delimiters between emails are , or ;

    * Workflow - this property **defines workflow** for the form.   
     In workflow, every email represents one step
     Worlflow step can also be "**initiator**", meaning, the one who created the form.

### Status broadcasts
* Defined with "Broadcast recievers" property in worflow part of form, it is a list of users that are notified when form moves from one user to another. This is usefull for tracking organization activities and overall health of the system.

### Data collection & export
* Data collectors are users specified in "Final step" property of the form.
* They recieve form and can see recieved forms as table, and then export and/or delete form data
* Supported export options is CSV file.

## DataChief security
* DataChief has Built in secret (symmetric key) and everything it does is encrypted with it – easily cracked since source code is avalaible
* Organization secret – if set, this is used(together with DataChief built in secret ) for encryprion of form templates when publishing. It ensures identity of publisher. DataCheif sends digest of this secret within every package. First time user recieve Package she or he can approve or disapprove publisher by accepting/refusing this digest. If publisher later changes Organization secret, user will be again prompted wheather she or he accepts digest(publisher). Before accepting, user should confirm with publisher that change of Organization secret is really happening and that this is not case of malicious attack.
* User secret in Single account mode – in this mode messages share single IMAP account, so to make sure that one user can not read others messages, they are encrypted with User Secret. This means that all users must be defined in Designer/Publisher with user secrets. Specific user secret must be set on each individual DataChief Filler installation.

## DataChief Communction is made via Packages
* Package is zero or more forms and commands.
* Package is always created per user who recieves them.
* User(s) who recieve package(s) must accept Organization secret digest. If publisher later changes Organization secret, user will be again prompted wheather she or he accepts digest(publisher). Before accepting, user should confirm with publisher that change of Organization secret is really happening and that this is not case of malicious attack.
* When publishing, Package for user will DELETE ALL PREVIOUSLY PUBLISHED FORMS. This means that publisher must always publish all active forms.
* If you want to revoke user, You can create empty command (empty package will be created) for that user
* Commands are:
    * Delete all local copies from publisher - deletes every filled or half filled form(sent forms folder, outbox folder, work folder, recieved folder) from that publisher. This can be usefull when employee is leaving organization or organization internal security policy changes.
    * Send text message – sends text message that will be displayed to user.

## What's next?
Take a look at our [Barrique Works LLC Case Study](/Case%20study%20Barrique%20Works%20LLC.md). 


"Immediately Expunge Messages when I mark them deleted in IMAP"