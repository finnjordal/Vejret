var express= require('express')
	,	io = require('socket.io')
	,	Gif = require('./gif');


var app= express()
	, server = require('http').createServer(app)
  , io = io.listen(server)
  ,	port= 3000;

var animation= new Gif('http://www.dmi.dk/dmi/radar-animation640.gif','/images/animation.gif');
animation.on('event', function() {console.log('animation event')});

// image skal ikke hentes for hver enkelt socket connection. Det skal fixes.
io.sockets.on('connection', function (socket) {
	setInterval(function () {	
		animation.getGif();
  	socket.emit('animation', { hello: 'world' });
	},10000);
});

app.use(express.static(__dirname + '/public'));

app.get('/images/animation.gif', function (req,res) {
	console.log("get('/images/animation.gif')");
	animation.getGifAndRespond(res);
});

app.get('/images/:postnr/:dage/byvejr.gif', function (req,res) {
	var postnr= req.params.postnr;
	var dage= req.params.dage;
	console.log("get byvejr for " + postnr + " i " + dage + "dage");
	var url= "";
	if (dage === "2") {
		url=  "http://servlet.dmi.dk/byvejr/servlet/byvejr_dag1?mode=long";
	}
	else if (dage === "9") {
		url=  "http://servlet.dmi.dk/byvejr/servlet/byvejr?tabel=dag3_9";
	}
	else if (dage === "14") {
		url=  "http://servlet.dmi.dk/byvejr/servlet/byvejr?tabel=dag10_14";
	}
	url= url + "&by=" + postnr;
	var byvejr= new Gif(url,req.originalUrl);
	byvejr.getGifAndRespond(res);
});

server.listen(port, function () {
	console.log('app listening on *:'+port);
});