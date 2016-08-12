/**
 * NodeJS ZetCom RIA API (v1)
 *
 * @author Romain de Wolff
 * 
 * @class ria
 */

var request = require('request');
var xml2js = require('xml2js').parseString; // doc @ https://github.com/Leonidas-from-XIV/node-xml2js
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird');

var noOp = function(){};

var Ria = function(opts) {
	opts = opts ||  {};
	this.sessionKey = opts.sessionKey || ''; /* this is the session key used for communication */
	this.versionApi = '1';
	this.instanceUrl = opts.instanceUrl || '';
	this.username = opts.username || '';
	this.password = opts.password || '';
    this.debug = opts.debug || false; // used to display extra debug info
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

/**
 * Set the creditentials.
 * @param username {String} The username
 * @param password {String} The password
 */
Ria.prototype.setCreditentials = function(username, password) {
	this.username = username;
	this.password = password;
};

/**
 * Set the instance URL. These must be a complete and valid URL to an RIA application from Zetcom.
 * Example syntax: https://mp-ria-89.zetcom.com/mpCustomerName
 *
 * @param instanceUrl {String} The instance URL
 */
Ria.prototype.setInstanceUrl = function(instanceUrl) { // needs end slash "/"
	this.instanceUrl = instanceUrl;
}

/**
 * Retrieves the session key
 * @returns {string} The session key
 */
Ria.prototype.getSessionKey = function() {
	return this.sessionKey;
}

/**
 * Set the session key
 * @param key {String} The session key
 */
Ria.prototype.setSessionKey = function(key) {
	this.sessionKey = key;
}

/**
 * Async version of the _login method
 * Return a thunked version of _login function
 */
Ria.prototype.loginAsync = function() {
    return Promise.delay(1000);
    /*return function (callback) {
        return this._login(callback);
        console.log('test');
    }*/
};

// this needs to be done prior to any other actions so the api key is retrieved
/**
 * Login on the RIA API and store the session key.
 * @param  {Function} callback The callback function that'll be called upon completion.
 * @return {[type]}            [description]
 */
Ria.prototype._login = function(callback){
    // prepare the request's payload
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
			callback(new Error(err), res);
		} else {
			// console.dir(res.html.body);
			self.sessionKey = res.application.session[0].key[0]; // store the session key for futur request
			// debug
            if (this.debug)
                console.dir("Session Key : " + self.sessionKey);
			callback(err, res);
		}
	});

}

/**
 * Execute a request on the server.
 *
 * @param options {Object} Option object with attributes : url, method, headers
 * @param callback {Function} Callback function
 * @param returnFormat {String} Define the wanted result format (possible values are 'xml' and 'json'
 * @returns {*}
 * @private
 */
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
	// debug request options : console.dir(options);
	// debug : find caller funciton console.log(arguments.callee.caller.toString());

	return request(options, function (err, res, body) {
	  if (err) {
	    callback(err, null)
	  } else {
	  	switch(res.statusCode){
            case 400:
                callback(new Error('400 : Bad request'), null);
	  		case 403:
	  			callback(new Error('403 : Access forbidden'), null);
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

Ria.prototype._get = function(path, callback, returnFormat) {
	returnFormat = returnFormat || 'xml';
	return this._request({
		url: path
	}, callback, returnFormat);
};

Ria.prototype._post = function(path, body, callback, returnFormat) {
	returnFormat = returnFormat || 'xml';
	return this._request({
		url: path,
		method: "POST",
		headers: {
			'Content-Length' : body.length
		},
		body: body
	}, callback, returnFormat);
}

Ria.prototype._delete = function(path, callback) {
	return this._request({
		url: path,
		method: "DELETE"
	}, callback);
}

// DELETE http://.../ria-ws/application/session/{session-key}
Ria.prototype.deleteSession = function(callback) {
	return this._delete('/ria-ws/application/session/' + this.sessionKey, callback);
}

Ria.prototype.getAllModuleDefinition = function(callback) {
	return this._get('/ria-ws/application/module/definition/', callback);
}

Ria.prototype.getModuleDefinition = function(moduleName, callback, returnFormat) {
	return this._get('/ria-ws/application/module/' + moduleName + '/definition/', callback, returnFormat);
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
Ria.prototype.postModuleSearch = function(moduleName, searchCriteria, callback, returnFormat) {
	returnFormat = returnFormat || 'xml';
	return this._post('/ria-ws/application/module/' + moduleName + '/search/', searchCriteria, callback, returnFormat);
}

/* ****************************************************************************
   These functions are built to retrieve selective information from within XML
   data and return them directly in JSON format  for easier Javascript
   manipulation. These have been tailored for mpProxy.
   **************************************************************************** */

// get a list of all the existing modules
Ria.prototype.getModuleList = function(callback, returnType) {
	returnType = returnType || 'array';

	return this._get('/ria-ws/application/module/definition/', function filterResult(err, msg){
		if (returnType === 'array') {
			var moduleNames = [];
		} else {
			var moduleNames = {};
		}

		// this get the full module name : msg.application.modules[0].module[0].$.name
		for (var i = msg.application.modules[0].module.length - 1; i >= 0; i--) {
			// debug console.log(msg.application.modules[0].module[i].$.name);
			moduleNames[i] = {content: msg.application.modules[0].module[i].$.name};
		};

		callback(err, moduleNames); // FIXME not clean callback, attention to visibility
	}, 'json');
}

Ria.prototype.getModuleObjects = function(moduleName, callback) {
  // get all the object via a search
  this.getAllObjectFromModule(moduleName, function(err, res) {
    console.dir(err);

    // forEach on the object
    res.application.modules[0].module[0].moduleItem.forEach(function(item) {
      console.log(item.$.id + ' (uuid : '+item.$.uuid+')');
    });
    /*
    // TODO : check if need to take care of special characters before conversion to json ?
    for (item in res.application.modules[0].module[0].moduleItem) {
      // console.dir(item); // moduleItem[0].systemField);
      console.dir(JSON.stringify(item));
    }*/

    //console.dir(JSON.stringify(res));

  }, 'json');
}

// returns the fields in JSON format
Ria.prototype.getModuleFields = function(moduleName, callback) {
	
	this.getModuleDefinition(moduleName, function(err, res) {
		if (err) 
			console.dir(err);
		// TODO: repeatableGroup, moduleReference, composite 
		var typeOfFields = ['systemField', 'dataField', 'vocabularyReference', 'virtualField']
		var fields = [];

		for (i=0; i<typeOfFields.length; i++) {
			console.log('processing ' + typeOfFields[i]);
			// check if this type of field exist
			if (res.application.modules[0].module[0].moduleItem[0][typeOfFields[i]]) {
				res.application.modules[0].module[0].moduleItem[0][typeOfFields[i]].forEach(function(item) {
					//console.log(item.$);
					fields.push({
						type: typeOfFields[i], 
						dataType: item.$.dataType, 
						name: item.$.name,
						id: item.$.id,
						instanceName: item.$.instanceName,
					});
				});	
			}
			
		}

		//console.log(res.application.modules[0].module[0].moduleItem[0].systemField);
		/*
		res.application.modules[0].module[0].moduleItem[0].systemField.forEach(function(item) {
			console.log(item.$);
			fields.push({type: 'systemField', dataType: item.$.dataType || '', name: item.$.name});
		});
*/
		console.log(fields);

		return callback(err, fields);
		/*
		console.dir(res.application.modules[0].module[0].moduleItem.forEach(function(item) {
			console.log(item.dataType, item.name);
			//fields[iteam]
		}));*/
	}, 'json');
	
}

// get all the object from a module, either as JSON or XML
Ria.prototype.getAllObjectFromModule = function(moduleName, callback, returnFormat) {
	returnFormat = returnFormat || 'xml';
	if (returnFormat === 'xml') {
		return this.postModuleSearch(moduleName, '<application xmlns="http://www.zetcom.com/ria/ws/module/search" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.zetcom.com/ria/ws/module/search http://www.zetcom.com/ria/ws/module/search/search_1_0.xsd"><modules><module name="'+moduleName+'"><search><fulltext>*</fulltext></search></module></modules></application>', callback);
	} else {
		return this.postModuleSearch(moduleName, '<application xmlns="http://www.zetcom.com/ria/ws/module/search" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.zetcom.com/ria/ws/module/search http://www.zetcom.com/ria/ws/module/search/search_1_0.xsd"><modules><module name="'+moduleName+'"><search><fulltext>*</fulltext></search></module></modules></application>', callback, returnFormat);
	}

}
