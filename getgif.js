var	request= require('request');

var functions= {};

var images= {};	

functions.getGif= function (externUrl, internUrl) {
	request.get({uri: externUrl, encoding: null}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			console.log(internUrl);
	  	images[internUrl]= {url: externUrl, data: body};
	  }
	});
}

functions.respond= function (res, internUrl) {
	console.log('respond: ' + internUrl);
	res.writeHead(200,{'Content-Type': 'image/gif'});
	res.end(images[internUrl].data);
	console.log('respond slut: ');
}

functions.getGifAndRespond= function (externUrl, internUrl, res) {
	if (images[internUrl]) {
		respond(res, internUrl);
	}
	else {
		request.get({uri: externUrl, encoding: null}, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
				console.log(internUrl);
		  	images[internUrl]= {url: externUrl, data: body};
				functions.respond(res, internUrl);
		  }
		});
	}
}

functions.getGif('http://www.dmi.dk/dmi/radar-animation640.gif','/images/animation.gif');

module.exports= functions;