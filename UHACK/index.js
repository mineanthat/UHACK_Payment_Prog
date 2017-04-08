var MicroGear = require('microgear');
var http = require('http');
var fs = require('fs');
var express = require('express')();

const APPID  = "UHACK";
const KEY    = "KIGJDCbLa46B6tP";
const SECRET = "BODTyyclr3qIgeuEDpB0Hxx1h";

http.createServer(function (request, response) {
	
	var url = request.url;
	
	var microgear = MicroGear.create({
		key : KEY,
		secret : SECRET
	});

	microgear.on('connected', function() {
		console.log('Connected...');
		microgear.setAlias("NodeServe");
		microgear.subscribe("/Sends/UID");
	});
	
	microgear.on('message', function(topic,body) {
		console.log('incoming : ' + topic + ' : ' + body);
		// Simulate Database
		if (body == "041e4c0a554880") {
			microgear.publish("/accept/keys", "true,id00000001");
			console.log("publish success");
		} else if (body == "043c3842a44980") {
			microgear.publish("/accept/keys", "true,id00000002");
		} else if (body == "043968aa414680") {
			microgear.publish("/accept/keys", "true,id00000003");
		} else {
			microgear.publish("/accept/keys", "false");
		}
	});
	
	switch(url) {
		case '/':
			getStaticFileContent(response, 'index.html', 'text/html');
			break;
		case '/confirm':
			getStaticFileContent(response, 'confirm.html', 'text/html');
			break;
		default:
			response.writeHead(404, {'Content-Type':'text/plain'});
			response.end('404 - Page not Found.');
	}
	
	microgear.connect(APPID);
}).listen(9090);
console.log('server running at http://localhost:9090');

function getStaticFileContent(response, filepath, contentType) {
	fs.readFile(filepath, function(error ,data) {
		if (error) {
			response.writeHead(500, {'Content-Type':'text/plain'});
			response.end('500 - Internal Server Error.');
		}
		if (data) {
			response.writeHead(200, {'Content-Type':'text/html'});
			response.end(data);
		}
	});
}