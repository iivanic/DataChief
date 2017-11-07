this.scriptName = "Absence Test Script: ";
this.doneCallback = null;
this.runTest = function()
{
    helper.log(this.scriptName + "Test Abence start & end");
    if(this.doneCallback)
        this.doneCallback();
}