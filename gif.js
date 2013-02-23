var	request= require('request')
	, EventEmitter = require('events'). EventEmitter
	, util = require("util");

var images= {};	

function Gif (externUrl, internUrl) {
	this.externUrl= externUrl;
	this.internUrl= internUrl;
	this.getGif();
}

util.inherits(Gif, EventEmitter);

Gif.prototype.getGif= function () {
	var me= this;
	request.get({uri: this.externUrl, encoding: null}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			console.log(me.internUrl);
	  	images[me.internUrl]= {url: me.externUrl, data: body};
	  	me.emit('event');
	  }
	});
};

Gif.prototype.respond= function (res) {
	console.log('respond: ' + this.internUrl);
	res.writeHead(200,{'Content-Type': 'image/gif'});
	res.end(images[this.internUrl].data);
	console.log('respond slut: ');
};

Gif.prototype.getGifAndRespond= function (res) {
	if (images[this.internUrl]) {
		this.respond(res);
	}
	else {		
		var me= this;
		request.get({uri: this.externUrl, encoding: null}, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
				console.log(me.internUrl);
		  	images[me.internUrl]= {url: me.externUrl, data: body};
				me.respond(res);
		  }
		});
	}
};

module.exports= Gif;