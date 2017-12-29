
this.scriptName = " Reset IMAP Script: ";
this.doneCallback = null;
this.next = null;
this.prepareDoneCallback = null;
this.publishDoneCallback = null;

// dumy, just to implement interface like methods
this.prepare = function (callback) {
    helper.log(this.scriptName + "Prepare.");
    helper.log(this.scriptName + "start.");
    helper.log(this.scriptName + "Clearing IMAP.");
    
    imap.clearErythingFromFolder();

    helper.log(this.scriptName + "End prepare.");
    callback();
}
// dumy, just to implement interface like methods
this.publish = function (callback) {
    helper.log(this.scriptName + "Publish.");
    callback();
}

this.runTest = function()
{
    if(this.doneCallback)
    {
        //bind correct 'this'
        var c =this.doneCallback.bind(this.next);
        c();
    }
}