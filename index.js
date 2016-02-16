//var winstate = require("./winstate.js");

var menu = require("./menu.js");
//var remote = require("remote");

var pjson = require('./package.json');

//document.write("verzija Node.js = " + process.version);

//var fs = require("fs");

//var c = fs.readFileSync("package.json", "utf8");
//document.write("<hr/> " + c);

$('#header').append(getWelcomeMessage());
$('#description').append(getDescription());

$( "#tabs" ).tabs();

function getWelcomeMessage() {
    var ret = "Welcome to " + pjson.name + ", version " + pjson.version + " created by " + pjson.author;
    return ret;

}
function getDescription() {
    var ret = pjson.description;
    return ret;

}
