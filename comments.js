// Create web server// 1. Create web server
// 2. Read URL and parse parameters
// 3. Read file
// 4. Output file contents

// Import modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

// Create web server
http.createServer(function (req, res) {
    // Read URL and parse parameters
    var q = url.parse(req.url, true);

    // If comment is being posted
    if (q.pathname == '/post') {
        // Read POST data
        var body = '';
        req.on('data', function (data) {
            body += data;
        });

        // When POST data is finished
        req.on('end', function () {
            // Parse POST data
            var post = qs.parse(body);

            // Read comments file
            fs.readFile('comments.txt', function (err, data) {
                // If file doesn't exist, create it
                if (err) {
                    fs.writeFile('comments.txt', '', function (err) {
                        if (err) throw err;
                        console.log('Created comments.txt');
                    });
                }

                // Append new comment
                fs.appendFile('comments.txt', post.comment + '\n', function (err) {
                    if (err) throw err;
                    console.log('Appended comment');
                });
            });

            // Redirect to home page
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    }
    // If home page is being requested
    else {
        // Read file
        fs.readFile('comments.txt', function (err, data) {
            // If file doesn't exist, create it
            if (err) {
                fs.writeFile('comments.txt', '', function (err) {
                    if (err) throw err;
                    console.log('Created comments.txt');
                });
            }

            // Output file contents
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head></head><body><form method="post" action="post"><textarea name="comment" style="width: 100%; height: 200px;"></textarea><br><input type="submit" value="Post"></form><br><br><b>Comments</b><br><br>' + data + '</body></html>');