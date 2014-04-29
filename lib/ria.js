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
//	, base64 = utile.base64; // this is not directly required, as we can use .toString('base64')

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

Ria.prototype.getSessionKey = function() {
	return this.sessionKey;
}

// this needs to be done prior to any other actions so the api key is retrieved
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
		if (err) {
			console.dir(err);
		} else {
			// console.dir(res.html.body);
			self.sessionKey = res.application.session[0].key[0]; // store the session key for futur request	
			// debug
			console.dir("KEY HERE = " + self.sessionKey);
			callback();
		}
	});
	
}

// returnFormat possible value are 'xml' or 'json'
Ria.prototype._request = function(options, callback, returnFormat){
	callback = callback || noOp;
	options = options || {};
	returnFormat = returnFormat || 'json'

	options.url = this.instanceUrl + options.url; // add the instance URL 
	options.method = options.method || 'GET'; // default use GET
	options.headers = options.headers || {}; // TODO cleanup
	options.headers['Content-Type'] = 'application/xml'; // RIA api works with XML contents
	if (!options.headers['Authorization']) {
		options.headers['Authorization'] = 'Basic ' + new Buffer('user['+this.username+']:session['+this.sessionKey+']').toString('base64')	
	}
	console.dir(options);

	return request(options, function (err, res, body) {
	  if (err) {
	    callback(err, null)
	  } else {
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
	  			if (returnFormat === 'json') {
		  			xml2js(body, function(err, result) {
						callback(null, result);
					});	
	  			} else {
	  				callback(null, body);
	  			}
	  			
	  			
	  	}
	  }
	  /* // debug info
	  console.log('statusCode: ' + res.statusCode);
	  console.dir('headers: ' + res.headers)
	  console.dir('response: ' + res.response)
	  console.dir('body: ' + body)
	  */
	})
};

Ria.prototype._get = function(path, callback) {
	return this._request({
		url: path
	}, callback, 'xml');
};

Ria.prototype._post = function(path, body, callback) {
	return this._request({
		url: path,
		method: "POST",
		headers: {
			'Content-Length' : body.length
		},
		body: body
	}, callback, 'xml');
}

Ria.prototype.getAllModuleDefinition = function(callback) {
	return this._get('/ria-ws/application/module/definition/', callback);
}

Ria.prototype.getModuleDefinition = function(moduleName, callback) {
	return this._get('/ria-ws/application/module/' + moduleName + '/definition/', callback);
}

// GET http://.../ria-ws/application/module/{module}/{__id}
// TODO Path not found or application error, how does this work?
Ria.prototype.getModuleItem = function(moduleName, id, callback) {
	return this._get('/ria-ws/application/module/' + moduleName + '/' + id, callback);
}

// TODO GET http://.../ria-ws/application/module/{module}/{__id}/attachment

// GET http://.../ria-ws/application/module/{module}/orgunit
Ria.prototype.getModuleOrgunits = function(moduleName, callback) {
	return this._get('/ria-ws/application/module/' + moduleName + '/orgunit', callback);
}

// GET http://.../ria-ws/application/module/VocabularyGroup/100000051
Ria.prototype.getVocabularyGroup = function(id, callback) {
	return this._get('/ria-ws/application/module/VocabularyGroup/' + id, callback);
}

// GET http://.../ria-ws/application/module/Vocabulary/100000060
Ria.prototype.getVocabulary = function(id, callback) {
	return this._get('/ria-ws/application/module/Vocabulary/' + id, callback);
}

// POST http://.../ria-ws/application/module/{module}/search/
Ria.prototype.postModuleSearch = function(moduleName, searchCriteria, callback) {
	return this._post('/ria-ws/application/module/' + moduleName + '/search/', searchCriteria, callback);
}









































