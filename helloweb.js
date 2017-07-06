'use strict';

var http = require('http'),
    fs = require('fs');

var server = http.createServer(function (request, response) {
    console.log(request.method + ': ' + request.url);
    if (request.method === "POST") {
        request.addListener("data", function (postDataChunk) {
            var dataRecieve = JSON.parse(postDataChunk.toString());
            console.log(dataRecieve);
            fs.appendFile('output.txt', postDataChunk.toString() + '\n', function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('output ok.');
                }
            });
        });
        request.addListener("end", function () {
            console.log('数据接收完毕');
            response.writeHead(200);
            response.end('^o^');
        });
        return;
    }
    var fileName = request.url.split("/")[1];
    if (fileName === "favicon.ico" || fileName === "") {
        fileName = "tomatoTimer.html";
    }
    console.log(fileName);
    fs.stat(fileName, function (err, stats) {
        if (!err && stats.isFile()) {
            console.log('200' + request.url);
            response.writeHead(200);
            fs.createReadStream(fileName).pipe(response);
        } else {
            console.log('404 ' + request.url);
            response.writeHead(200);
            response.end('-_-!');
        }
    });

});

// 让服务器监听8080端口:
server.listen(8080);

console.log('Server is running at http://127.0.0.1:8080/');