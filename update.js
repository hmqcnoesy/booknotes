var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');

var allFiles = fs.readdirSync(__dirname);
var fileContents = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
var $ = cheerio.load(fileContents);
var options = '<option></option>';

for (var i = 0; i < allFiles.length; i++) {
    if (!/\.md/.test(allFiles[i])) continue;
    
    options += '<option value="' + allFiles[i] + '">' + allFiles[i].replace('.md', '') + '</option>';
    console.log(allFiles[i]);
}

$('#selTitle').html(options);

fs.writeFileSync(path.join(__dirname, 'index.html'), $.html(), 'utf8');

// update select in index.html to have an option for each .md file.
// maybe put links in divMarkdown for each too?