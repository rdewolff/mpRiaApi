/**
 * NodeJS ZetCom RIA API (v1)
 * 
 * Inspired by the Asana JS lib @ https://github.com/rushis/asana-api/blob/master/lib/asana.js
 * @author Romain de Wolff
 * @class riajs
 */

var request = require('request');
var xml2js = require('xml2js').parseString;

//	, utile = require('utile')
//	, base64 = utile.base64;

var noOp = function(){};

var Ria = function(opts) {
	opts = opts ||  {};
	this.api_key = opts.api_key    || ''; /* this is the encoded username and password for RIA */
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
	this.api_key = 'Basic ' + new Buffer('user['+username+']:password['+password+']').toString('base64');
};

Ria.prototype.setInstanceUrl = function(instanceUrl) { // needs end slash "/"
	this.instanceUrl = instanceUrl;
}

Ria.prototype.setApiKey = function(api_key){
};

Ria.prototype._handshake = function() {

};

Ria.prototype._request = function(options, callback){
	
	callback = callback || noOp;

	var currentOptions = {
	  url: this.instanceUrl + 'ria-ws/application/session',
	  methode: 'GET',
	  headers: {
	      'Content-Type': 'application/xml',
	      'Authorization': this.api_key // 'Basic ' + new Buffer('user['+username+']:password['+password+']').toString('base64')
	  }   
	}

	options = options || currentOptions;

	request(options, function (err, res, body) {
	  if (err) {
	    // console.dir(err)
	    callback(err, null)
	  } else {
	  	console.dir(res.statusCode)
	  	switch(res.statusCode){
	  		case 404:
	  			callback(new Error('Path not found'), null);
	  			break;
	  		case 422:
	  			callback(new Error(res.body.message), null);
	  			break;
	  		default:
	  			xml2js(body, function(err, result) {
					this.sessionKey = result.application.session[0].key[0]; // store the session key for futur request
					console.dir(this.sessionKey);
				});
	  			callback(null, this.sessionKey);
	  	}
	  }
	  /*
	  console.log("StatusCode = " + res.statusCode);
	  console.dir('headers', res.headers)
	  console.dir('status code', res.statusCode)
	  console.dir(res.response)
	  console.dir(body)
	  */
	  
	})
};