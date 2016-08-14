var net = require('net')

var HOST = '127.0.0.1';
var PORT = 1337;

var clients = [];

net.createServer(function(sock){
	console.log("new connection from :"+ sock.remoteAddress);
	clients.push(sock);

	sock.write('Hello : ' + sock.remoteAddress + ' !\n');
	sock.pipe(sock);

	sock.on('data', function(data){
		if(data.indexOf("/quit") > -1){
			sock.write("bye");
			sock.unref();
			sock.end();
			clients.splice(clients.indexOf(sock), 1);
			return;
		}
		console.log('DATA ' + sock.remoteAddress + ': ' + data);
		data += '\n';
		broadcast(data, sock);
	});

	function broadcast(message, sender){
		clients.forEach(function(client){
			if(client === sock) return;
			client.write(message);
		});
	}

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);
