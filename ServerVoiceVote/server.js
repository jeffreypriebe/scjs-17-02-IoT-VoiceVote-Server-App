var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	socketio = require('socket.io'),
	io = socketio(server);

var port = 30902;

io.listen(port);
console.log('socket listening on ' + port);

io.on('connection', function(socket) {
	
	socket.on('join', function(data) {
		var name = data.name;
		
		console.log('Joining room: ' + name);
		
		socket.join(name);
		socket.room = name;
	});
	
	socket.on('message', function(data) {
		console.log('Emitting in \'' + socket.room + '\': ' + JSON.stringify(data));
		socket.broadcast.to(socket.room).emit('message', data);
	});
});