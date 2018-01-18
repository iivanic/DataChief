# Case study: „Barrique Works LLC“


## What they do?


Barrique Works LLC (BW) is company that produces oak barrels for winemakers.

## Simplified company organization structure:

-   **CEO** - Mary S, [*mary@barriqueworks.com*](mailto:mary@barriqueworks.com)
    -   **Accounting** - Richard V, [*richard@barriqueworks.com*](mailto:richard@barriqueworks.com)
    -   **HR** - John L, [*john@barriqueworks.com*](mailto:john@barriqueworks.com)
    -   **Quality management** - Quality Manager - Daniel S, [*daniel@barriqueworks.com*](mailto:daniel@barriqueworks.com)
    -   **IT** - James R, [*james@barriqueworks.com*](mailto:james@barriqueworks.com)
    -   **Sales** – Sales Manager - Patricia M, [*patricia@barriqueworks.com*](mailto:patricia@barriqueworks.com)
        -   Sales Representative - Jennifer B, [*jennifer@barriqueworks.com*](mailto:jennifer@barriqueworks.com)
        -   Sales Representative - Michael W, [*michael@barriqueworks.com*](mailto:michael@barriqueworks.com)
        -   Sales Representative - Elizabeth F, [*elizabeth@barriqueworks.com*](mailto:elizabeth@barriqueworks.com)
    -   **Customer support** - Margaret R, [*margaret@barriqueworks.com*](mailto:margaret@barriqueworks.com)
    -   **Production** – Production Manager - Robert P, [*robert@barriqueworks.com*](mailto:robert@barriqueworks.com)
        -   William D, [*william@barriqueworks.com*](mailto:william@barriqueworks.com)
        -   Linda J, [*linda@barriqueworks.com*](mailto:linda@barriqueworks.com)
        -   David F, [*david@barriqueworks.com*](mailto:david@barriqueworks.com)

## What are the challenges?


Company wants to implement their business processes in digital form. This includes:
-   Vacation/absence requests
-   Car usage logs
-   Quality management preventive/corrective action form (ISO 9001:2015)


## What are the options?


-   Implement various free and/or commercial products for each challenge: CRM, BMP, etc... This option is most complicated and has many unknowns regarding additional employee education, TCO (Total cost of ownership), deadlines and overall effectiveness.
-   Order custom LOB (Line of business) solution. This is probably most expensive option, and deadline and overall success is not guaranteed – It depends on quality of hired company as on BW itself.
-   Use “DataChief” (DC) as tool to implement requirements in-house. DC is free, flexible and can be implemented in phases.

Decision has been made to use DC.

## Implemented forms:


### 1st Simulation - Vehicle usage log
#### Description
-   Company needs to track usage of cars used by sales representatives.
-   Sales representatives:  Jennifer B, Michael W and Elizabeth F can use cars.
-   Sales manager, Patricia M needs to review usage of cars.
-   Richard V., from accounting needs to collect data for expense tracking.
### Implementation
-   Form in editor has been designed which includes car, usage and mileage details with signatures for employee and Sales manager.
-   "Publish to" property of the form has been set to employees in sales department: "**jennifer@barriqueworks.com, michael@barriqueworks.com, elizabeth@barriqueworks.com**". Form will be published to them.
- patricia@barriqueworks.com as set as "Workflow". When Sales people fill out their part of form ant submit it, she will receive  the form.
- "Final step" is richard@barriqueworks.com. He will have Database for this form. He is also set for "Broadcast receivers", this means that he will know how many forms has been submitted to Patricia even if she did not send the form(s) to Richard ("Data Collection" tab, sub-tab "Received status broadcasts", sub-tab "Graphical View" and then choose form in drop-down box)
- "Allow return" property is set to true, so Patricia can send invalid form back to initiator.
- "Allow local copies" is set to everyone, form does not have any confidential data, so initiators can keep sent forms ("Filler" tab and then click on  "Sent Forms" ).
- Forms needs to be save to Publish folder and published.

#### Test
- With "Case study profiles" installed in "Form Designer and Publisher" Datachief mode, simulation test can be run ("Settings" tab under Behavior, choose "Run Car Usage log simulation" script to run).
- It will take few minutes for the script to finish.
- Three forms have been submitted, and one returned to initiator by Patricia. Then it was fixed and sent again.
- In the end, Richard has three forms in DB (switch to Richard under "Settings" tab, and under profile choose Richard (he is "Final step"). Then switch to "Data Collection" tab and "Data Collection" sub-tab). Here you can also click on individual row to see Form saved in DB (with "print to PDF"  and "Details & History" option).
- Then switch to "Received statuses broadcast" (Richard is also broadcast receiver) sub-tab and "Graphical View" sub-tab and choose "Car Log". Graph will be displayed illustrating workflow with forms count.

See **Notes on test scripts** in the bottom of this file.



### 2nd simulation - Employee absence request 
#### Description
- Company needs to collect and manage absence requests from production department.
- William D, Linda J, David F work in production
- Request first needs to be approved with HR (John L) and then by Production manager Robert P.
- John L in HR needs to receive final forms for HR database
- HR needs to be notified what is happening with this process and also the person who initiated the form needs to know how their form is progressing.

### Implementation
- Form has three "Group or Repeater"s - one for request, one for HR approval, one for manager approval.
- properties for the form are set as following
    - "Publish to" is set to production department: "william@barriqueworks.com, linda@barriqueworks.com, david@barriqueworks.com"
    - "Workflow" is HR and then manager: "john@barriqueworks.com, robert@barriqueworks.com"
    - Initiator and  john@barriqueworks.com are "Broadcast receivers".
    - "Final step" is, of course, john@barriqueworks.com
    - "Allow local copies" is allowed for everyone
    - "Allow return" is checked
- Forms needs to be save to Publish folder and published.
#### Test
- With "Case study profiles" installed in "Form Designer and Publisher" Datachief mode, simulation test can be run ("Settings" tab under Behavior, choose "Run Absence Form simulation" script to run).
- It will take few minutes for the script to finish.
- Two employees have submitted one request and one employee have submitted two request, all with different reason
- All Forms finished with HR smoothly
- In "Settings" tab switch to John profile and look into his DB to see what has been done


### 3rd simulation - Preventive / corrective action
- Company needs to digitally collect and manage Corrective/Preventive actions, instead of using cumbersome printed forms.
- Every Employee can submit Corrective/Preventive action to Quality Manager - Daniel S.
- Daniel then takes steps to check wheatear this is something that needs to be processed.
- If so, he needs to take unknown number of actions to analyze, correct or prevent problem and take additional steps to avoid that problem in future.
- Daniel also keeps Database of submitted forms

### Implementation
- Form has three "Group or Repeater"s - one for request, one for submitting data on the problem, second is analysis and third if follow up.
- Follow Up group has "Repeater" checked so Daniel can enter unknown number of actions.
- properties for the form are set as following
    - "Publish to" is set to whole company
    - "Workflow" is daniel@barriqueworks.com
    - Initiator and  john@barriqueworks.com are "Broadcast receivers".
    - "Final step" is daniel@barriqueworks.com
    - "Allow local copies" is allowed only for initiator
    - "Allow return" is checked
- Forms needs to be save to Publish folder and published.
#### Test
- With "Case study profiles" installed in "Form Designer and Publisher" Datachief mode, simulation test can be run ("Settings" tab under Behavior, choose "Run Quality Management simulation" script to run).
- It will take few minutes for the script to finish.
- Two employees have submitted forms
- In "Settings" tab switch to Daniel profile and look under "Filler" tab
- You will see received form from Margaret and other from David
- Daniel has done analysis on David’s form and some Follow up

## Note on test scripts
- Messages are uploaded to IMAP account via IMAP protocol (no SMTP server is used). Still, some tested implementations of IMAP service (Gmail seems to be working fine) does not show uploaded file immediately. This will cause  test script to skip some messages, and final result will be different that described in Case Study. You can delete DB and IMAP messages and run script again.
- This, however, does not mean that such IMAP services are not usable with DC, because in real situations this won't matter. 
