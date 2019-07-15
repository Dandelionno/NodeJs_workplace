var http = require('http')
var url = require('url')
var util = require('util')
var querystring = require('querystring')

http.createServer(function (request, response) {
	var post = ''
	var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.")

    // 解析参数
    request.on('data', function(chunk){    
        post += chunk;
    });
    post = querystring.parse(post)	
	console.log(post)

    response.writeHead(200, {'Content-Type': 'text/plain'})

    response.end(util.inspect(url.parse(request.url, true)))
}).listen(8888)

console.log('Server running at http://127.0.0.1:8888/')