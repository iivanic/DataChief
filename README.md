# DataChief
Flexible **Data Collection eForms Solution** with focus on **usability** and **simplicity** that actually **works in the real world**.

##What is it for?
DataChief enables you to rapidly implement processes in your company/organization with no cost - all you need is email account(minimal requirement). Used in a right way DataChief can save you tons of money and nerves. You can immediatly bring order into chaos, implement solution for your sales force in the field, track activities within company and/or implement managamenet systems like ISO 9001(QM), ISO 14001(EMS), ISO 27001(ISMS), ISO 20001(SMS)/ITIL with ease. 

You don't have to be blocked anymore by expensive Line of business (LOB) applications development that never ends, and when they are finally ready, they are often obsolete.

Take a look at [Barrique Works LLC Case Study](./Case study Barrique Works LLC.md). 

##Roadmap
Project is under develpment. First release will provide basic functionality for designing forms, simple workflows, and collecting data.
* Multiplatform (developed in Electron)
    * Windows
    * Linux
    * Mac OSX
* Planned features
    * - Visual and user friendly form designer '90%'
    * Many type of controls
        * Text box, ListBox, Group fields ...
        * Repeaters
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
Smartphone versions are planned, and are crucial part of DataChief. This software is being developed on 200US$ 2-in-1 10" tablet, so until release of smartphone versions for your mobile needs you can use device(s) such as Asus Transformer Book T100, Acer Aspire Switch 10 or similar.
 
##How do I start with DataChief before release?
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
    * now You can open it with **Microsoft Visual Studio Code**. Depending on the platform You may also need to change **"runtimeExecutable"** line in lanch.json. For **Windows**: "**${workspaceRoot}/node_modules/.bin/electron.cmd**", for **Linux**: "**${workspaceRoot}/node_modules/.bin/electron**" and for **Mac OSX** use "**${workspaceRoot}/node_modules/electron-prebuilt/dist/electron.app/Contents/MacOS/Electron**"
    * press **F5** to run DataChief