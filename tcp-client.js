var net = require('net');
var args = require('yargs').argv;
var readline = require('readline');

function isDef(obj){
	return(!(obj == undefined));
}

const rl = readline.createInterface({
	input: process.stdin
});

var remoteAddress = args.addr;
var port = args.port;
var nick = args.nick;

if (!isDef(nick)){
	nick = "user";
}

var client = new net.Socket();

client.connect(port, remoteAddress, function(){
	console.log('connected to ' + remoteAddress + ' on ' + port);
});

client.on('data', function(data){
	if (data == "bye") {
		process.exit();
		return;
	}
	console.log(data.toString('ascii'));
});

rl.on('line', function(input){
	var data = nick + '>' + input;
	client.write(data);
});

