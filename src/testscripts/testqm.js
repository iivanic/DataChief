this.scriptName = "Quality Management Test Script: ";
this.doneCallback = null;
this.runTest = function()
{
    helper.log(this.scriptName + "Test QM start & end");
    if(this.doneCallback)
        this.doneCallback();
}