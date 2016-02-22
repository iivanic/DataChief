# DataChief
Flexible **Data Collection eForms Solution** with focus on **usability** and **simplicity** that actually **works in the real world**.

##What is it for?

##Roadmap
Project is under develpment. First release will provide basic functionality for designing forms, simple workflows, and collecting data.
* Multiplatform (developed in Electron)
    * Windows
    * Linux
    * Mac OSX
* Planned features
    * Visual and user friendly form designer
    * Simple workflow designer
    * Many type of controls
        * Text box, Check box, Date time, ...
        * Lists, data from web services
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
    
##How do I start with DataChief before release?
* You will need **Node.js**, **Git** and **Microsoft Visual Studio Code** already installed.
* From command line:
    * pull source code from GitHub: ```
    git clone https://www.github.com/iivanic/datachief.git
    ```
    * go to project root: ```
    cd datachief/
    ```
    * install electron-prebuild - it is not included: ```
    npm install electron-prebuilt --save-dev
    ```
    * now You can open it with **Microsoft Visual Studio Code**. Depending on the platform You may also need to change ```"runtimeExecutable"``` line in lanch.json. For **Windows**: "```${workspaceRoot}/node_modules/.bin/electron.cmd```", for **Linux**: "```${workspaceRoot}/node_modules/.bin/electron```" and for **Mac OSX** use "```${workspaceRoot}/node_modules/electron-prebuilt/dist/electron.app/Contents/MacOS/Electron```"
    * press **F5** to run DataChief