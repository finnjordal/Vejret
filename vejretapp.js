var express= require('express')
	,	request= require('request');

var images= {};	

function getGif(externUrl, internUrl) {
	request.get({uri: externUrl, encoding: null}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			console.log(internUrl);
	  	images[internUrl]= body;
	  }
	});
}

function respond(res, internUrl) {
	console.log('respond: ' + internUrl);
	res.writeHead(200,{'Content-Type': 'image/gif'});
	res.end(images[internUrl]);
	console.log('respond slut: ');
}

function getGifAndRespond(externUrl, internUrl, res) {
	if (images[internUrl]) {
		respond(res, internUrl);
	}
	else {
		request.get({uri: externUrl, encoding: null}, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
				console.log(internUrl);
		  	images[internUrl]= body;
				respond(res, internUrl);
		  }
		});
	}
}

getGif('http://www.dmi.dk/dmi/radar-animation640.gif','/images/animation.gif');

var app= express();

app.use(express.static(__dirname + '/public'));

app.get('/images/animation.gif', function (req,res) {
	console.log("get('/images/animation.gif')");
	getGifAndRespond('http://www.dmi.dk/dmi/radar-animation640.gif','/images/animation.gif', res);
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
	getGifAndRespond(url,req.originalUrl, res);
});

app.listen(3000, function () {
	console.log('app listening on *:3000');
});