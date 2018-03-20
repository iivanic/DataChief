// iherit from base class
this.__proto__ = require("./fieldBase.js");
//var helper = require("./utils.js");

this._type = "currentGPSPosition";
this.lastError=null;

this._propsMeta = {
    // Since string is the default no nees to specify type
    _displayName: { group: 'Field Settings', name: 'Name', description: 'Name of the field.', showHelp: true },
    _toolTip: { group: 'Field Settings', name: 'Tooltip', description: 'Tooltip for the field.', showHelp: true },
    GOOGLE_API_KEY: { group: 'Field Settings', name: 'GOOGLE API KEY', description: 'GOOGLE API KEY for geo location. Get it at https://console.developers.google.com', showHelp: true },
    _description: { group: 'Field Settings', name: 'Description', description: 'Description of the field.', showHelp: true },
    _required: { group: 'Field Validation', name: 'Required', description: 'Is this field required?', showHelp: true },
    _requiredErrorMessage: { group: 'Field Validation', name: 'Required error message', description: 'Massege whe required field is missing.', showHelp: true },
    _children: { browsable: false },
    _value: { browsable: false },
    _propsMeta: { browsable: false },
    _id: { browsable: false },
    _lastCumulativeId: { browsable: false },
    _form: { browsable: false },
    _parent: { browsable: false },
    lastError: { browsable: false },
    idprefix: { browsable: false },
    
    _type: { browsable: false }
}

this.render = function (form, parent, placeholder, editable, user, idprefix) {
    this.idprefix=idprefix;
    if(user=="initiator")
        user = userSettings.email;
    //  console.log("currentUserField.render()");
    var disabled = parent.disabled;
    this._form = form;
    this._parent = parent;
    this._lastCumulativeId = idprefix + "_" + this.id;
    var ctlbox = "";

    if (editable)
        ctlbox = helper.loadFieldBox();
    ctlbox = ctlbox.replace('{id}', "ctlbox_" + idprefix + "_" + this.id)
    var ret = "";
    if (editable)
        ret += ctlbox;
    ret += "<div id='field_" + idprefix + "_" + this.id + "' class='datachiefFieldRow'><label for='" + idprefix + "_" + this.id + "' title='" + this.toolTip + "'>" + this.displayName + (this.required ? "<span title='This field is Required' class='datachiefFieldRequired'>*</span>" : "") + "</label>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    //   if (this._value == "" && !disabled) {
    ret += "<div class=row><div class='col-sm-6'>";
    ret += "<button  id='" + idprefix + "_" + this.id + "_button' type='button' style='width:100%;' class='btn btn-secondary'>" + (this._value == "" ? "Get position" : "Clear position") + "</button>";
    ret += "</div><div class='col-sm-6'>";
    //  }
    ret += "<input data-validation-required-message='" + this._requiredErrorMessage + "' " +
        (this._required ? "required" : "") + " readonly style='width:100%' type='text'  id='" + idprefix + "_" + this.id + "' class='datachiefField currentGPSPositionFiledMarker' value='" + this.position2Text(this._value) + "' />";
    // if (this._value == "" && !disabled) {
    ret += "<p class='help-block'></p></div></div>";
    ret += "<span id='" + idprefix + "_" + this.id + "_error' class='red'>" + (this.lastError? this.displayError() :"" )  + "</span>";
    // }
    ret += "</div>";
    return ret;
};
this.displayError = function()
{
    return "Geo location needs GPS sensor on your device or Internet Connection and GOOGLE_API_KEY set. Error: " + this.lastError.message 
}
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "currentGPSPosition";
    this._id = "";
    this._value = "";
    this._toolTip = "Current GPS position";
    this._description = "Where are you now?";
    this._displayName = "GPS position";
    this._required = true;
    this._requiredErrorMessage = "This field is required.";
    this._form = null;
    this._parent = null;
    this.lastError=null;
    this.GOOGLE_API_KEY = "AIzaSyDbpAr6vFKM4T0lwNlD3v9r43ieTyqn9rI";
this.idprefix = "";
}
this.findField = function (idwithprefix) {
    //   console.log("currentUserField.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        //     console.log("currentUserField.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}
this.getPosition = function()
{
    const electron = window.require('electron'); 
    const remote = electron.remote; //... console.log(remote.process.env["TZ"]);
    remote.process.env.GOOGLE_API_KEY = this.GOOGLE_API_KEY;
    this.lastError=null;
    navigator.geolocation.getCurrentPosition(this.readPosition, 
        function(err){
            helper.log("currentGPSPosition error: code=" + err.code + ", message=" + err.message);
            this.lastError=err;
            $("#" + this.idprefix + "_" + this.id + "_error").html(this.displayError());
        }.bind(this) 
        ,
        {
       //     maximumAge: 75000,
            enableHighAccuracy: true
        });
}



this.readPosition = function(position)
{
    alert("position");
    /*
        coords.latitude	double	decimal degrees
        coords.longitude	double	decimal degrees
        coords.altitude	double or null	meters above the reference ellipsoid
        coords.accuracy	double	meters
        coords.altitudeAccuracy	double or null	meters
        coords.heading	double or null	degrees clockwise from true north
        coords.speed	double or null	meters/second
        timestamp	DOMTimeStamp	like a Date() object
    */
   this._value = position;
}
this.position2Text = function(pos)
{
    var  ret="";
    if(!pos)
    return ret;
    ret = pos.coords.latitude + ", " + pos.coords.longitude + " (acc=" + pos.coords.accuracy + "m)";
    return ret;
}


