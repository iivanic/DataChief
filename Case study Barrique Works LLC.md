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
        -   Sales Representative - jennifer B, [*jennifer@barriqueworks.com*](mailto:jennifer@barriqueworks.com)
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


### Vehicle usage log
#### Description
-   Company needs to track usage of cars used by sales representatives.
-   Sales representatives:  Jennifer B, Michael W and Elizabeth F can use cars.
-   Sales manager, Patricia M needs to review usage of cars.
-   Richard V., from accounting needs to collect data for expense tracking.
### Implementation
-   Form in editor has been designed which includes car, usage and mileage details with signatures for employee and Sales manager.
-   "Publish to" property of the form has been set to employees in sales department: "**jennifer@barriqueworks.com, michael@barriqueworks.com, elizabeth@barriqueworks.com**". Form will be published to them.
- patricia@barriqueworks.com as set as "Workflow". When Sales people fill out their part of form ant submit it, she will receive  the form.
- "Final step" is richard@barriqueworks.com. He will have Database for this form. He is also set for "Broadcast receivers", this means that he will know how many forms has been submitted to Patricia even if she did not sent the form(s) to richard ("Data Collection" tab, sub-tab "Received status broadcasts", sub-tab "Graphical View" and then choose form form drop-down box)
- "Allow return" property is set to true, so patricia can send invalid form back ti initiator.
- "Allow local copies" is set to everyone, form doues not have any confidiential data, so initiators can keep sent forms ("Filler" tab and then click on  "Sent Forms" ).
- Forms needs to be save to Publish folder and published.

#### Test
- With "Case study profiles" installed in "Form Designer and Publisher" Datachief mode, simulation test can be run ("Settings" tab under Behavior, Choose "Run Car Usage log simulation" script to run).
- It will take few minutes for the script to finish.
- Three forms have been submitted, and one returned to initiator by patricia. Then it was fixed and sent again.
- In the end, richard has three forms in DB (swith to richard under "Settings" tab, and under profile choose richard(he is Final step). Then switch to "Data Collection" tab and "Data Collection" sub-tab). Here you can also click on individual row to see Form saved in DB (with "print to PDF"  and "Detials & History" option).
- Then switch to "Recieved statuses broadcast" (Richard is also boradcast reciever) sub-tab and "Graphical View" sub-tab and choose "Car Log". Graph will be diplayed illustrating workflow with forms count.
- 
See **Notes on test scripts** in the bottom of this file.



### Employee absence requets 

-   Company needs to collect and manage absence requests.
#### Test

### Preventive / corrective action
-   Company needs to digitally collect and manage Corrective/Preventive actions, instead of using cumbersome printed forms.
#### Test

## Notes on test scripts
- Messages are uploaded to IMAP account via IMAP protocol (no SMTP server is used). Still, some tested implementiations of IMAP service(Gmail seems to be working fine) does not show uploaded file immidietly. This will couse test script to skip some messages, and final result will be different that described in Case Study. You can delete DB and IMAP messages and run script again.
- This, however, does not mean that such IMAP services are not usable with DC, becouse in real situations this won't matter. 
