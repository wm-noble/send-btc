
var fs = require('fs');
var minimize = require('minimize');
var node_minify = require('node-minify');

var html_mini = new minimize({
    empty: true,         // KEEP empty attributes 
    cdata: true,         // KEEP CDATA from scripts 
    ssi: true,           // KEEP Server Side Includes 
    conditionals: true,  // KEEP conditional internet explorer comments 
    spare: true,         // KEEP redundant attributes 
    quotes: true,        // KEEP arbitrary quotes 
    //loose: true,         // KEEP one space
    dom: {               // options of !(htmlparser2)[https://github.com/fb55/htmlparser2] 
        xmlMode: false,                 // Disables the special behavior for script/style tags (false by default) 
        lowerCaseAttributeNames: true,  // call .toLowerCase for each attribute name (true if xmlMode is `false`) 
        lowerCaseTags: true             // call .toLowerCase for each tag name (true if xmlMode is `false`) 
    }
});

fs.readFile('modal.html', 'utf8', function(err, html) {
    html_mini.parse(html, function(err, html) {
        fs.readFile('send-btc.js.in', 'utf8', function(err, js) {
            fs.writeFile('send-btc.js', js.replace('@MODAL_HTML@', html), function(err) {
                new node_minify.minify({
                    type: 'yui-js',
                    fileIn: 'send-btc.js',
                    fileOut: 'send-btc.min.js',
                    callback: function(err, min) {
                        console.log(err);
                    }
                });
            });
        });
    });
});

