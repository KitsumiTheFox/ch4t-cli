#!/usr/bin/env node
/* 
 * ch4t-cli - Ch4t.io terminal client using node.js
 * Copyright 2016 Kenneth Jensen <kbjensen@airmail.cc>
 */


/* Initialization */
console.log("Ch4t client started");

var username = "kek";
var util = require('util');
var socket = require("socket.io-client")("https://ch4t.io/dev");
var Backbone = require("backbone");
var CLIENT, ONLINE;

console.log("Socket initialized, opened");


/* Real shit */
process.stdin.resume();
process.stdin.setEncoding('utf8');
var util = require('util');

process.stdin.on('data', function (text) {
	socket.emit('message', {
		flair : username,
		message : text
	});
});

socket.on("connect", function() {
	console.log("Connected!");
	socket.emit('join', {
		nick : username,
		security : ""
	});
	ONLINE = new Backbone.Collection();
	CLIENT = (new Backbone.Model.extend());
});

socket.on('alive', function() {
	socket.emit('alive');
});

socket.on('message', function(msg) {
	console.log(msg.nick + ": " + msg.message);
});
