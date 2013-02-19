var express= require('express')
	,	request= require('request');

var images= {};	

request.get({uri: 'http://www.dmi.dk/dmi/radar-animation640.gif', encoding: null}, function (error, response, body) {
	console.log("animation");
  if (!error && response.statusCode == 200) {
		console.log("animation 200");
  	images["/images/animation.gif"]= body;
  }
});

var app= express();

app.use(express.static(__dirname + '/public'));

app.get('/images/animation.gif', function (req,res) {

	console.log("get animation");
	if (images["/images/animation.gif"]) {
		console.log("send animation");
		res.writeHead(200,{'Content-Type': 'image/gif'});
		res.end(images["/images/animation.gif"]);
	}
	else {

	}
});

app.listen(3000, function () {
	console.log('app listening on *:3000');
});