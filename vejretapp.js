var express= require('express')
	,	io = require('socket.io')
	,	gif = require('./getgif.js');


var app= express()
	, server = require('http').createServer(app)
  , io = io.listen(server)
  ,	port= 3000;


// image skal ikke hentes for hver enkelt socket connection. Det skal fixes.
io.sockets.on('connection', function (socket) {
	setInterval(function () {	
		gif.getGif('http://www.dmi.dk/dmi/radar-animation640.gif','/images/animation.gif');
  	socket.emit('animation', { hello: 'world' });
	},10000);
});

app.use(express.static(__dirname + '/public'));

app.get('/images/animation.gif', function (req,res) {
	console.log("get('/images/animation.gif')");
	gif.getGifAndRespond('http://www.dmi.dk/dmi/radar-animation640.gif','/images/animation.gif', res);
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
	gif.getGifAndRespond(url,req.originalUrl, res);
});

server.listen(port, function () {
	console.log('app listening on *:'+port);
});