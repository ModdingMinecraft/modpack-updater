var fs = require('fs');
var url = require('url');
var request = require('request');
var cheerio = require('cheerio');

fs.readFile("downloadlist.json", "utf8", function(err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    var temp = {};
    var i, current, $;
    for (i = 0; i < obj.downloads.length; i++) {
        current = obj.downloads[i];
		fs.readFile("drivers/" + url.parse(current.url).host + ".js", "utf8", function(err, script) {
			if (err) throw err;
			eval(script); // There must be a better way to do this.
		});
    }
});
