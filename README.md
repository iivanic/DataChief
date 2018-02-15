# DataChief
Flexible **Data Collection eForms Solution** with focus on **usability** and **simplicity** that actually **works in the real world**.

[![DataChief video](https://img.youtube.com/vi/FtSYBAkyJig/0.jpg)](https://www.youtube.com/watch?v=FtSYBAkyJig)

## What is it for?
DataChief enables you to **rapidly implement processes in your company/organization with no cost** - all you need is email account. Used in a right way DataChief can save you tons of money and nerves. You can immediately bring order into chaos, implement solution for your sales force in the field, track activities within company and/or implement management systems like **ISO 9001(QM), ISO 14001(EMS), ISO 27001(ISMS), ISO 20001(SMS)/ITIL** with ease. 

## Features
Project is under development. First release provides basic functionality for designing forms, simple workflows, and collecting data.
* Multiplatform (developed in Electron)
    * Windows
    * Linux
    * Mac OSX
* Features
    * Visual and user friendly form designer
    * Many type of controls
        * Text box, ListBox, Group fields ...
        * Repeaters for table implementation
    * Simple communication protocols - One IMAP email for whole organization
    * Offline / low signal support
    * Ability to configure local cache - You can prohibit sensitive data to stay on client
    * Publishing & revoking of templates
    * Collection and export for analysis
 
## How do I start with DataChief

* Download & install provided binary package, depending on platform

## How to Configure Datachief
* Make sure your IMAP account has username & password authentication enabled (xoauth, xoauth2 will be enabled in future releases).
* Step 1 of the configuration wizard - There are two modes, you choose them in the first step (to simplify deployment in your organization we provide binary distribution locked to "Client Only" mode):
    * Client Only
        * This mode is for majority of users in your organization. It can create new instances of published forms and receive them and can also be final step in workflow (database).
        * It cannot design or publish new forms, or use it to run built in simulation tests based on Barrique Works LLC case study.
    * Enable Form Designer and Publisher
        * Make sure you enable this if you are the admin in your organization so you can create and publish new forms
        * Enable this if you want to learn and/or test Data Chief and run simulated tests (actual workflow simulation) based on Barrique Works LLC case study.
        * Make sure you install "Case Study users" in configuration wizard. They are required for running simulation tests.
* "Company" step of the configuration wizard   
    * This is available only if you have chosen "Enable Form Designer and Publisher" mode
    * Enter your organization name and secret
    * Secret is used to verify your identity as person who publishes Forms.
    * For testing purposes you can leave default values
* "Your name and Email" step of the configuration wizard
    * Enter your name and email
    * Email in Data chief uniquely identifies persons
    * Since we are using single IMAP account for communication Email dois not have to be existing email account. You will set up real IMAP account in the next step
    * Enter shared secret. Every installation in your organization have to have the same Shared secret. This is used for encryption to protect communication from outside attacks.
* "Communication (IMAP)" step of the configuration wizard
    * Enter your IMAP account configuration here. Do the same in every installation in your organization.
* "Case study"
    * This is available only if you have chosen "Enable Form Designer and Publisher" mode
    * install Case study users so you can run simulation tests.


    
## How does it work?
DataChief is simple solution that allows you to **define your forms, publish and collect them** on multiple platforms (Windows, MacOSX, Linux). DataChief requires no additional network services except IMAP (Email) account.
![DataChief simple workflow](/dc_workflow.png)

### Users
In DataChief users are identified with **Emails**, but those emails do not have to exists, since we are using only one IMAP account for communication.

### Communication
Communication between user is made via IMAP account. No SMTP server is required. DataChief can use existing Email account and account can be used in parallel with regular, non-datachief emails. Imap folder called "Datachief" will be created and datachief will not touch anything outside that folder. 

### Forms
DataChief allows you to define your data structure with custom forms designed in provided **Form Editor**. Multiple types of controls are available, including repeater groups to allow you to implement data that is on paper forms usually defined as table with multiple empty rows.

### Workflow
* Following Form properties helps to define workflow
    * **Broadcast receivers** - this is list of users that are notified when form moves from one user to another. Think of those users as monitors. Users can also, instead of emails be special address strings as
        * "**initiator**" - person who actually creates form
        * "**everyone**" - everyone in Workflow meanining everyone in "Publish To" +  "Workflow" + "Final Step"
    * **Allow local copies** - list of users that will keep sent copy of the form in their local folder. Can also be special address string 
        * "**everyone**"
    * **Final step** - this is one or more user(s) that collects the data. DataChief is not designed as database for millions of forms, so those users should periodically export collected data as CSV file and delete Datachief DBs.
    * **Publish To** - this property defines who can start empty form. 
     All properties can have multiple users. Users are defined as emails delimited with delimiters.
     Delimiters between emails are , or ;

    * **Workflow** - this property **defines workflow** for the form.   
     In workflow, every email represents one step
     Workflow step can also be "**initiator**", meaning, the one who created the form.

### Status broadcasts
* Defined with "**Broadcast receivers**" property in workflowpart of form, it is a list of users that are notified when form moves from one user to another. This is usefull for tracking organization activities and overall health of the system.

### Data collection & export
* Data collectors are users specified in "**Final step**" property of the form.
* They receive forms and they can see received forms as table, and then export and/or delete form data
* Supported export options is CSV file.

## DataChief security
* **Organization secret** – It ensures identity of publisher. DataCheif sends digest of this secret within every package. First time user receive Package she or he can approve or disapprove publisher by accepting/refusing this digest. If publisher later changes Organization secret, user will be again prompted whether she or he accepts digest(publisher). Before accepting, user should confirm with publisher that change of Organization secret is really happening and that this is not case of malicious attack.
* **Shared secret** – to make sure no one outside organization can submit false data to your workflow, all communication is encrypted with Shared secret known only to organization members. When security of secret is compromised, you must set new Shared secret within organization members (including the publisher)

## DataChief Communction is made via Packages
* Package is zero or more forms and commands.
* Package is always created per user who receives them.
* User(s) who receive package(s) must accept Organization secret digest.
* When publishing, Package for user will DELETE ALL PREVIOUSLY PUBLISHED FORMS (form templates, not partially filled forms). This means that publisher must always publish all active forms.
* If you want to revoke user, you can create empty command (empty package will be created) for that user
* Commands are:
    * Delete all local copies from publisher - deletes every filled or half-filled form (sent forms folder, outbox folder, work folder, received folder) from that publisher. This can be usefull when employee is leaving organization or organization internal security policy changes.
    * Send text message – sends text message that will be displayed to user.

## How to I start with source code or test new version before release?
* You will need [**Node.js**](https://nodejs.org/), [**Git**](https://git-scm.com) and, optionally, [**Microsoft Visual Studio Code**](https://code.visualstudio.com/) already installed.
* Execute following commands from command line:
    * pull source code from GitHub:
    
        `git clone https://www.github.com/iivanic/datachief.git`
    * go to project root: 
    
        `cd datachief/`
    * install electron-prebuild, node-imap, ...  - they are not included: 
    
        `npm install` 
    * now You can start DataChief with
    
        * `npm start` 
        * or open it with **Microsoft Visual Studio Code** and press **F5** to run DataChief.
## Command line params:
You must first configure DataChief IMAP account in "Form Designer and Publisher" mode and add Case study users to use Car log, Absence, and Quality management test simulation scripts.

`npm run start -- --runalltests`
* deletes DB an runs all tests. Recommended for learning and using provided Case study. App wil exit after it's done and then start it with 
`npm start`

`npm run start -- --runresetdb`
* deletes DB

`npm run start -- --runtestcarlog`
* runs test script for case study Vehicle usage form

`npm run start -- --testabsence`
* runs test script for Absence request form

`npm run start -- --runtestqm`
* runs test script for Quality Management form

`npm run start -- --enabledisklog`
* enables writing log file to disk on startup (for troubleshooting).

`npm run start -- --runresetimap`
* connects to IMAP server and deletes everything (within Datachief folder).

## What's next?
Take a look at our [Barrique Works LLC Case Study](/Case%20study%20Barrique%20Works%20LLC.md). 
