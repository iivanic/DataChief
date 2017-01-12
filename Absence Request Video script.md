Hello, this is Igor,
Let's learn how to use DataChief.

Today, We will learn how to craate electronic Form, publish, collect and analyze data.
First, of course, we need DataChief installed.

-   After starting DataChief, in first step in configuration wizard is we must choose "Enable Form Designer and Publisher (for Admins in your organization)" to enable Designer and Publisher
-   In next step we need to enter Your Organization name and password. In this demo we will use "Barrique Works LLC Case study" distributed with DataChief, so you can leaave this screen as is.
-   Next we will choose "Single user account" operating mode, becouse it is much simpler to use for testing and demos. This means that we will need only one IMAP email account for the whole organization.
-   In step 4 under "Your Name" enter "James R" as in Barrique Works LLC James is the IT guy, so he will porbably be DAta Cheif administrator
    -   Under email enter "james@barriqueworks.com"
    -   For "Your secret" enter 123 twice, it will do for this demo.
-   In "Case Study users" step click on "Add Barrique Works LLC Case study Profiles" to install users from BW Case study.
-   In "Set Up IMAP(Email) Account." step you need to setup working IMAP email account. In  "Single user account" operating mode this is the account that is used for ALL communcations.
Now we are ready to start.

We need to collect Absence Request Froms (ARF) from Production department. Memebers of Production department are:
-   William D, [*william@barriqueworks.com*](mailto:william@barriqueworks.com)
-   Linda J, [*linda@barriqueworks.com*](mailto:linda@barriqueworks.com)
-   David F, [*david@barriqueworks.com*](mailto:david@barriqueworks.com)
so we need to publish Absence Request to them.
Request must be approved by Production Manager - Robert P.
Finally, Form needs to finish in HR database with John L - [*john@barriqueworks.com*](mailto:john@barriqueworks.com)

So, let's create our Form:
-   Make sure You are in "Form & Workflow editor" main tab
-   then click on "Create From button"
-   under "Form name" enter "Absence Request"
-   There's tablate for similiar form already in DataChief, but for the purpose of this video, we will create one from scratch.
-   Click "Create Empty" button
-   Now we have our empty Form. On the right side are Form or fileds properties, main part of the screen contains Form.
-   On the right, in properties, under "Forms Settings/Description" enter "This Absence Request form should be submitted by employee and then approved by manager."
-   On the right, in properties, under "Forms Settings/Footer" enter "Example Absence Request Request Form.", then click "Apply Changes button". We see our Form has changed.
-   In Workflow part of Properties under "Publish To" write three emails from Production departmen, comma delimited
    -     william@barriqueworks.com, linda@barriqueworks.com, david@barriqueworks.com
-   In Workflow part of Properties under "Workflow" write "robert@barriqueworks.com", as he needs to approve Request
-   In Workflow part of Properties under "Final step" write "john@barriqueworks.com", as he needs this request for HR database
-   In Workflow part of Properties under "Broadcast recievers" write "initiator, john@barriqueworks.com", as we want person who filled request to see progress of his/her request. We also want HR to know how many unfinished Absence request are outhere.
-   In Workflow part of Properties under "Allow local copies" write "everyone", as we want to allow everyone to have local copy of what have they done with request.
-   All properties under Workflow part can have emeils and special string "inititator". Properties "Broadcast recievers" and "Allow local copies" can have additional special addresses: "everyone" and "stepN", where N is workflow index (step1 for first, step0 is the sam as initiator)
-   Click "Apply Changes" button again. 

Now, we have set our Form properties. Let's create some text fields.

