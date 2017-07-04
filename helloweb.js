'use strict';

var http = require('http'),
    fs = require('fs');

var server = http.createServer(function (request, response) {
    console.log(request.method + ': ' + request.url);
    var fileName = request.url.split("/")[1];
    if (fileName === "favicon.ico" || fileName === ""){
        fileName = "tomatoTimer.html";
    }
    console.log(fileName);
    fs.stat(fileName, function (err, stats) {
        console.log(err);
        console.log(stats);
        if (!err && stats.isFile()) {
            console.log('200' + request.url);
            response.writeHead(200);
            fs.createReadStream(fileName).pipe(response);
        } else {
            console.log('404 ' + request.url);
            response.writeHead(200);
            response.end('404 Not Found');
        }
    });
});

// 让服务器监听8080端口:
server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');