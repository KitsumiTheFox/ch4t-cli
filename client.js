#!/usr/bin/env node
/* 
 * ch4t-cli - Ch4t.io terminal client using node.js
 * Copyright 2016 Kenneth Jensen <kbjensen@airmail.cc>
 */


/* Initialization */
console.log("Ch4t client started");

var socket = require("socket.io-client")("https://ch4t.io/");
var Backbone = require("backbone");
var CLIENT, ONLINE;

console.log("Socket initialized, opened");


/* * * * * *
 * Real shit
 * * * * * */

function print(data, type) {
	var d = new Date();
	var h = d.getHours().toString();
	var m = d.getMinutes().toString();
	var time = ((h.length < 2 ? 0 + h : h) + ":" + (m.length < 2 ? 0 + m : m));

	console.log(time + " " + data);
}
// Handle input
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (text) {
	socket.emit('message', {
		message : text
	});
});

// Show messages
socket.on('message', function(msg) {
	if (msg.type == 'personal-message') 
		print('==== '+ msg.nick + ": " + msg.message, 'private');
	else print(msg.count + ' ' + msg.nick + ": " + msg.message, 'general');

});
socket.on('centermsg', function(data) {
	print('Background message changed to: ' + data.msg, 'server');
});

// User leaves/joins
socket.on('left', function(user) {
	ONLINE.remove(user.id);
	print(user.nick + ' has left ' + (user.part || ''), 'left');
});
socket.on('join', function(user) {
	print(user.nick + ' has joined', 'join');
});


// Unimportant shit the server likes
socket.on('alive', function() {
	socket.emit('alive');
});

socket.on("connect", function() {
	console.log("Connected!");
	socket.emit('join');
	ONLINE = new Backbone.Collection();
	CLIENT = (new Backbone.Model.extend()); 
});

socket.on('online', function(users) {
	ONLINE.add(users);
});
// Jester is a skiddie lamer
