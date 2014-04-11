/**
 * NodeJS ZetCom RIA API (v1)
 * 
 * Inspired by the Asana JS lib @ https://github.com/rushis/asana-api/blob/master/lib/asana.js
 * @author Romain de Wolff
 * @class riajs
 */

var request = require('request');
//	, utile = require('utile')
//	, base64 = utile.base64;

var noOp = function(){};

var Ria = function(opts) {
	opts = opts ||  {};
	this.api_key = opts.api_key    || ''; /* this is the encoded username and password for RIA */
	this.sessionKey = opts.sessionKey || '';
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

Ria.prototype._request = function(option, callback){
	callback = callback || noOp;

	var options = {
	  url: this.instanceUrl + 'ria-ws/application/session',
	  methode: 'GET',
	  headers: {
	      'Content-Type': 'application/xml',
	      'Authorization': this.api_key // 'Basic ' + new Buffer('user['+username+']:password['+password+']').toString('base64')
	  }   
	}

	request(options, function (err, res, body) {
	  if (err) {
	    console.dir(err)
	    return
	  }
	  console.log("StatusCode = " + res.statusCode);
	  console.dir('headers', res.headers)
	  console.dir('status code', res.statusCode)
	  console.dir(res.response)
	  
	  console.dir(body)

	})

	this.sessionKey = ""; // store the session key for futur request
};