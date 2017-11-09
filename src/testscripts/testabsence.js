this.scriptName = "Absence Test Script: ";
this.doneCallback = null;
this.next = null;
this.runTest = function()
{
    helper.log(this.scriptName + "Test Abence start & end");
    if(this.doneCallback)
    {
        //bind correct 'this'
        var c =this.doneCallback.bind(this.next);
        c();
    }
}