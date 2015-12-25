#!/usr/bin/env node
/*
 * ch4t-cli-ncurses - Ch4t.io terminal client using ncurses
 * Copyright 2016 Kenneth Jensen <kbjensen@airmail.cc>
 */



/* Initialization */
var socket = require('socket.io-client')('https://ch4t.io');
var blessed = require('blessed');
var screen = blessed.screen();
var box = blessed.box({
	bottom: 2
});

var inputline = blessed.textbox({
	height: 1,
	bottom: 0,
	inputOnFocus: true,
	style: {
		bg: 'white',
		fg: 'black'
	}
});

screen.append(box);
screen.append(inputline);


screen.key(['escape', 'C-c'], function(ch, key) {
	return process.exit(0);
});

inputline.key('enter', function(ch, key) {
	parse(inputline.getValue());
	inputline.setValue('');
	screen.render();
	inputline.focus();
});

inputline.focus();
screen.render();

// Only responsible for showing text to client
function print(data, type) {
	var d = new Date();
	var h = d.getHours().toString();
	var m = d.getMinutes().toString();
	var time = ((h.length < 2 ? 0 + h : h) + ":" + (m.length < 2 ? 0 + m : m));

	box.insertLine(0,time + ' ' + data);
	screen.render();
}

// Sends & parses data
function parse(data) {
	data = data.replace(/\n$/, "");
	if (data.indexOf("/")) {
		socket.emit('message', { message: data });
		return;
	}
	return;
}

/* NOW IT BEGINS */
socket.on('message', function(msg) {
	if (msg.type == 'personal-message')
		print('==== ' + msg.nick + ": " + msg.message, 'private');
	else print(msg.count + ' ' + msg.nick + ": " + msg.message, 'general');
});

socket.on('centermsg', function(data) {
	print('Background message changed to: ' + data.msg, 'server');
});

socket.on('left', function(user) {
	print(user.nick + ' has left ' + (user.part || ''), 'left');
});
socket.on('join', function(user) {
	print(user.nick + ' has joined', + 'join');
});

// Unimportant shit the server likes
socket.on('alive', function() {
	socket.emit('alive');
});

socket.on('connect', function() {
	print('Connected', '');
	socket.emit('join');
});
