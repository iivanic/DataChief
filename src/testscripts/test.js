// this is javascript test file for automated testing, executed with "eval"

testStep1();

//1. check for case study users
function testStep1()
{
    helper.log(":::Welcome to TEST. Please DO NOT TOUCH ANYTHING.");
    helper.log(":::Test step 1 - check for case study users.");
    if(!barrique.isInstalled())
        helper.log(":::BarriqueWorks case study users not installed. Install them and run test again.");
    else
    {
        helper.log(":::OK - BarriqueWorks case study users found.");
        testStep2();
    }
    
}

//2. check for design mode
function testStep2()
{
    helper.log(":::Test step 2 - check for design mode.");
    if(userSettings.clientOnly)
    {
        helper.log(":::No design mode detected. Please install DataChief in Design mode.");
    }
    else
    {
        helper.log(":::OK - Design mode detected.");
        testStep3();
    }
}

//3. clear local cache for every user
function testStep3()
{
    helper.log(":::Test step 3 - clear local cache for every user.");

    var folders = [
        "inbox",
        "myoutbox",
        "outbox",
        "prepublish",
        "publish",
        "publishers",
        "ready",
        "recieved",
        "sent",
        "work"
    ];
    var cnt=0;
    for(var u in userSettings.Identities)
    {
        cnt++;
      for(var f in folders)
        helper.deleteFolder(helper.join(helper.join(helper.getSettingsFolder(),userSettings.Identities[u]),folders[f]));
    }
    helper.log(":::" + cnt.toString() + " user folders (" + (cnt*(folders.length+1)).toString() + ") deleted.");
    testStep4();
}

//4. create and publish form(s)
function testStep4()
{
    helper.log(":::Test step 4 - create and publish form(s).");
    testStep5();
}

//5. go through worfflow for every user
function testStep5()
{
    helper.log(":::Test step 5 - go through worfflow for every user.");
    testStep6();
}

//6. done
function testStep6()
{
    helper.log(":::Test step 6 - finish.");
}