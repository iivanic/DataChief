var winstate = require("./winstate.js");

//alert(3);

//var menu = require("./menu.js");
//var remote = require("remote");

//var pjson = require('./../package.json');



//document.write("verzija Node.js = " + process.version);





//$( "#tabs" ).tabs();

function getWelcomeMessage(pjson) {
    var ret = "Welcome to " + pjson.name + " v" + pjson.version ;
    return ret;

}
function getDescription(pjson) {
    var ret = pjson.description;
    var showdown = require('./showdown-1.3.0/showdown.min');
    var converter = new showdown.Converter();
    var fs = require("fs");
    var path = require("path");
    var data = fs.readFileSync(path.resolve(path.join(__dirname, "../README.MD")));
    ret += "<hr />" +  converter.makeHtml(data.toString());;
    return ret;

}
$(document).ready(function () {
    var pjson = require('../package.json');
    $('#header').text(getWelcomeMessage(pjson));
    $('#description').html(getDescription(pjson));
});

