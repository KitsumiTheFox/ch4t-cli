#!/usr/bin/env node
/* 
 * ch4t-cli - Ch4t.io terminal client using node.js
 * Copyright 2016 Kenneth Jensen <kbjensen@airmail.cc>
 */


/* Initialization */
console.log("Ch4t client started");

var socket = require("socket.io-client")("https://ch4t.io/");
/*var Backbone = require("backbone");
var CLIENT, ONLINE;*/

console.log("Socket initialized, opened");


/* Real shit */
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (text) {
	socket.emit('message', {
		flair : "",
		message : text
	});
});

socket.on("connect", function() {
	console.log("Connected!");
	socket.emit('join', {
		nick : "",
		security : ""
	});
/* These are not currently being used
	ONLINE = new Backbone.Collection();
	CLIENT = (new Backbone.Model.extend()); 
*/
});

socket.on('alive', function() {
	socket.emit('alive');
});

socket.on('message', function(msg) {
	console.log(msg.nick + ": " + msg.message);
});
