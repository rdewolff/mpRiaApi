/**
 * NodeJS ZetCom RIA API (v1)
 * 
 * Inspired by the Asana JS lib @ https://github.com/rushis/asana-api/blob/master/lib/asana.js
 * @author Romain de Wolff
 * @class riajs
 */

var request = require('request');
var xml2js = require('xml2js').parseString; // doc @ https://github.com/Leonidas-from-XIV/node-xml2js

//	, utile = require('utile')
//	, base64 = utile.base64;

var noOp = function(){};

var Ria = function(opts) {
	opts = opts ||  {};
	this.sessionKey = opts.sessionKey || ''; /* this is the session key used for communication */
	this.versionApi = '1';
	this.instanceUrl = opts.instanceUrl || '';
	this.username = opts.username || '';
	this.password = opts.password || '';
};

var createInstance = function(opts) {
	return new Ria(opts);
};

/* For the sake of backwards compatibility I've made this method return an instance.
 * This particular instance has a createInstance factory method that can create other instances of the RIA class. 
 * In a future version this should be updated to:
 *    module.exports = createInstance; 
 * Set module.exports to the createInstance function
 */
module.exports = (function(){
	var ria = createInstance();
	ria.createInstance = createInstance;
	return ria;
})();

Ria.prototype.setCreditentials = function(username, password) {
	this.username = username;
	this.password = password;
};

Ria.prototype.setInstanceUrl = function(instanceUrl) { // needs end slash "/"
	this.instanceUrl = instanceUrl;
}

Ria.prototype._login = function(callback){

	var options = {
	  url: '/ria-ws/application/session',
	  method: 'GET',
	  headers: {
	      'Authorization': 'Basic ' + new Buffer('user['+this.username+']:password['+this.password+']').toString('base64')
	  }
	}

	var self = this;
	this._request(options, function(err, res){
		self.sessionKey = res.application.session[0].key[0]; // store the session key for futur request	
		// debug
		console.dir("KEY HERE = " + self.sessionKey);
		callback();
	});
	
}

Ria.prototype._request = function(options, callback){
	callback = callback || noOp;
	options = options || {};

	options.url = this.instanceUrl + options.url; // add the instance URL 
	options.method = options.method || 'GET'; // default use GET
	options.headers = options.headers || {}; // TODO cleanup
	options.headers['Content-Type'] = 'application/xml'; // RIA api works with XML contents
	if (!options.headers['Authorization']) {
		options.headers['Authorization'] = 'Basic ' + new Buffer('user['+this.username+']:session['+this.sessionKey+']').toString('base64')	
	}
	console.dir(options);

	request(options, function (err, res, body) {
	  if (err) {
	    // console.dir(err)
	    callback(err, null)
	  } else {
	  	// debug console.dir(res.statusCode)
	  	switch(res.statusCode){
	  		case 404:
	  			callback(new Error('404 : Path not found'), null);
	  			break;
	  		case 405:
	  			callback(new Error('405 : Method Not Allowed'), null);
	  			break;
	  		case 422:
	  			callback(new Error('422 : ' + res.body.message), null);
	  			break;
	  		default:
	  			xml2js(body, function(err, result) {
					callback(null, result);
				});
	  			
	  	}
	  }
	  /* // debug info
	  console.log("StatusCode = " + res.statusCode);
	  console.dir('headers', res.headers)
	  console.dir('status code', res.statusCode)
	  console.dir(res.response)
	  console.dir(body)
	  */
	})
};

Ria.prototype._get = function(path, callback) {
	return this._request({
		url: path
	}, callback);
};

Ria.prototype._post = function(path, body, callback) {
	return this._request({
		url: path,
		method: "PUT",
		headers: {
			'Content-Length' : body.length
		},
		body: body
	}, callback);
}

Ria.prototype.getModuleDefinition = function() {
	this._get('/ria-ws/application/module/definition/', function(err, res){
		if (err)
			console.dir(err);
		else {
			//console.log(res.html.body[0].h1); // display header
			console.log(res.application.modules); // display header
		}
	});
}