#!/usr/bin/env node

/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var sys = require('sys');
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtml = function(html, checksfile) {
    $ = cheerio.load(html);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    console.log( JSON.stringify(out, null, 4) );
};

var checkHtmlFile = function(htmlfile, checksfile) {
    //$ = cheerioHtmlFile(htmlfile);
    $ = cheerio.load(HtmlFile(htmlfile));
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        //.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html')
        .option('-u, --url <app_url>', 'URL to the web app')
        .parse(process.argv);
    var htmlContent = '';
    if ( program.file ) {
      htmlContent = fs.readFileSync(program.file);
      checkHtml(htmlContent, program.checks);
    } else if ( program.url ) {
      var rest = require('restler');
      rest.get(program.url).on('complete', function(result) {
        if (result instanceof Error) {
          sys.puts('Error fetching url (' + program.url + '): ' + result.message);
          //this.retry(5000); // try again after 5 sec
        } else {
          checkHtml( result, program.checks );
        }
      });
    } else {
      sys.puts("Must specify either '--url <URL>' or '--file <FILE>' option" );
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
