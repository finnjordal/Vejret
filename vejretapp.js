var express= require('express')
	,	io = require('socket.io')
	,	Gif = require('./gif').Gif
	,	Gifs = require('./gif').Gifs;


var app= express()
	, server = require('http').createServer(app)
  , io = io.listen(server)
  ,	port= 3000;

function buildInternUrl(postnr, dage) {
	return '/images/' + postnr + '/' + dage + '/byvejr.gif';
}

function buildExternUrl(postnr, dage) {
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
	return url;
}

var animation= new Gif('http://www.dmi.dk/dmi/radar-animation640.gif','/images/animation.gif',1);

// image skal ikke hentes for hver enkelt socket connection. Det skal fixes.
io.sockets.on('connection', function (socket) {
	animation.on('/images/animation.gif', function() {
  	socket.emit('/images/animation.gif');
	});	
	socket.on('byvejr', function(data) {
		var internUrl= buildInternUrl(data.postnr, data.dage);
		if (!Gifs[internUrl]) {
			Gifs[internUrl]= new Gif(buildExternUrl(data.postnr, data.dage), internUrl,60)
		}
		Gifs[internUrl].on(internUrl, function() {	
  		socket.emit(internUrl);
		});

	});
});

app.use(express.static(__dirname + '/public'));

app.get('/images/animation.gif', function (req,res) {
	animation.getGif(res);
});

app.get('/images/:postnr/:dage/byvejr.gif', function (req,res) {
	var postnr= req.params.postnr;
	var dage= req.params.dage;
	var url= buildExternUrl(postnr, dage);
	var byvejr= new Gif(url,req.originalUrl,60);
	byvejr.getGif(res);
});

server.listen(port, function () {
	console.log('app listening on *:'+port);
});