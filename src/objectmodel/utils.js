// helpers

this.generateGUID = function () {
    // not a real GUID, just a big random number
    // taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
this.loadTextFile= function (filename) {
    var fs = require("fs");
    var path = require("path");
    var data = fs.readFileSync(path.resolve(path.join(__dirname, filename)));
    return data.toString();
  };
  this.getCurrentUsername= function (filename) {
  
	var username =  require('child_process').execSync( "whoami", { encoding: 'utf8', timeout: 1000 } );
	return String(username).trim(); 
  };
