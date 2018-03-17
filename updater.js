(function() {

// Libraries
var fs = require("fs-extra");

// Functions
var checkFile = require("./func/checkFile.js");
var parseDownload = require("./func/parseDownload.js");
var downloadFile =  require("./func/downloadFile.js");

// Variables
var obj;
var delayedLog = [];

fs.readFile("downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    console._log = console.log;
    if (obj.config["delayed-log"]) {
        console.log = function() {
            if (arguments.length && typeof arguments[0] === "string") {
                if (arguments[0].startsWith("[")) {
                    delayedLog.push(Array.prototype.slice.call(arguments).join(" "));
                    return;
                }
                console._log.apply(this, arguments);
                return;
            }
            console._log.apply(this, arguments);
            return;
        }
    }
    fs.ensureDirSync(obj.config.folder);
    var iPad = 0;
    var current;
    for (var i = 0; i < obj.downloads.length; i++) {
        iPad = i.toString().padStart(obj.downloads.length.toString().length, "0");
        current = obj.downloads[i];
        checkFile(obj, current, i, iPad);
        if (current.url) parseDownload(obj, current, i, iPad);
    }
});

process.on('exit', function() {
    var delayedLogCopy = delayedLog.slice();
    delayedLog.sort(function(a, b) {
        var aInt = parseInt(a.substring(1, obj.downloads.length.toString().length + 1));
        var bInt = parseInt(b.substring(1, obj.downloads.length.toString().length + 1));
        if (aInt === bInt) return delayedLogCopy.indexOf(a) - delayedLogCopy.indexOf(b);
        return aInt - bInt;
    });
    while (delayedLog.length) {
        console._log(delayedLog.shift());
    }
    obj.downloads.sort((a, b) => a.name.localeCompare(b.name, 'en', {
        sensitivity: 'base'
    }));
    fs.writeFileSync("downloadlist.json", JSON.stringify(obj, null, 4) + "\n");
});

})();
