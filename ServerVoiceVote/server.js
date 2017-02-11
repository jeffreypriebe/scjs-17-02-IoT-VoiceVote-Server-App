const express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	socketio = require('socket.io'),
	io = socketio(server);

io.listen(30809);
console.log('socket listening on 30809');

io.on('connection', socket => {
	
	socket.on('join', data => {
		const { name } = data;
		
		console.log(`Joining room: ${name}`);
		
		socket.join(name);
		socket.room = name;
	});
	
	socket.on('message', data => {
		console.log(`Emitting in '${socket.room}': ${JSON.stringify(data)}`);
		socket.broadcast.to(socket.room).emit('message', data);
	});
});