/**
 * NodeJS ZetCom RIA API (v1.1)
 *
 * @author Romain de Wolff
 *
 * @class ria
 */

var request = require('request');
var xml2js = require('xml2js').parseString; // doc @ https://github.com/Leonidas-from-XIV/node-xml2js

var noOp = function(){};

var Ria = function(opts) {
	opts = opts ||  {};
	this.sessionKey = opts.sessionKey || ''; /* this is the session key used for communication */
	this.versionApi = '1.1';
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
};

Ria.prototype.getSessionKey = function() {
	return this.sessionKey;
};

Ria.prototype.setSessionKey = function(key) {
	this.sessionKey = key;
}

// this needs to be done prior to any other actions so the api key is retrieved
Ria.prototype.login = function(callback){
	var options = {
	  url: '/ria-ws/application/session',
	  method: 'GET',
	  headers: {
	    'Authorization': 'Basic ' + new Buffer('user['+this.username+']:password['+this.password+']').toString('base64')
	  }
	}

	var self = this;
	self.callback = callback;
	this._request(options, function(err, res, body){
		if (err) {
			self.callback(err, res, body);
		} else {
			// console.dir(res.html.body);
			self.sessionKey = body.application.session[0].key[0]; // store the session key for futur request
			// debug
			// console.dir("KEY HERE = " + self.sessionKey);
			self.callback(err, res, body);
		}
	});
}

Ria.prototype.loginPromise = function() {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.login(function callback(err, res, body) {
			if (err) {
				// sending all the results as one "payload object"
				reject({err, res, body});
			} else {
				// same as for reject, one object only sent back
				resolve({err, res, body});
			}
		})
	});
};


// returnFormat possible value are 'xml' or 'json'
Ria.prototype._request = function(options, callback, returnFormat){
	callback = callback || noOp;
	options = options || {};
	returnFormat = returnFormat || 'json';

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
	    callback(err, res, body);
	  } else {
	  	switch(res.statusCode){
	  		case 403:
	  			callback(new Error('403 : Access forbidden'), res);
	  		case 404:
	  			callback(new Error('404 : Path not found'), res);
	  			break;
	  		case 405:
	  			callback(new Error('405 : Method Not Allowed'), res);
	  			break;
	  		case 422:
	  			callback(new Error('422 : ' + res.body.message), res);
	  			break;
	  		default:
	  			/* debug :
	  			console.log('err', err);
	  			console.log('res', res);
	  			console.log('body', body); */
	  			if (returnFormat === 'json') {
						// transform data to JSON
		  			xml2js(body, function(err, json) {
		  				// console.log('res',res.statusCode);
							callback(err, res, json);
						});
	  			} else {
	  				callback(err, res, body);
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

Ria.prototype.getAllModuleDefinition = function(callback, returnFormat) {
	return this._get('/ria-ws/application/module/definition/', callback, returnFormat);
}

Ria.prototype.getModuleDefinition = function(moduleName, callback, returnFormat) {
	return this._get('/ria-ws/application/module/' + moduleName + '/definition/', callback, returnFormat);
}

// GET http://.../ria-ws/application/module/{module}/{__id}
// TODO Path not found or application error, how does this work?
Ria.prototype.getModuleItem = function(moduleName, id, args, callback, returnFormat) {
	// add args to URL like  /ria-ws/application/module/Object/1?loadAttachment=true
	var param = '';
	if (!args.loadThumbnailExtraSmall) {
		args.loadThumbnailExtraSmall = false;
	}
	if (!args.loadThumbnailSmall) {
		args.loadThumbnailSmall = false;
	}
	if (!args.loadThumbnailMedium) {
		args.loadThumbnailMedium = false;
	}
	if (!args.loadThumbnailLarge) {
		args.loadThumbnailLarge = false;
	}
	if (!args.loadThumbnailExtraLarge) {
		args.loadThumbnailExtraLarge = false;
	}
	if (!args.loadAttachment) { // this is the original pictures of the object
		args.loadAttachment = false;
	}
	for (var i = args.length - 1; i >= 0; i--) {
		if (args[i]) {
			param += i + '=true';
		}
	}
	for (var a in args) {
	  if (args.hasOwnProperty(a)) {
	    if (args[a]) {
	      param += a + '=' + args[a] + '&';
	    }
	  }
	}
	returnFormat = returnFormat || 'xml';
	return this._get('/ria-ws/application/module/' + moduleName + '/' + id + '?' + param, callback, returnFormat);
}

Ria.prototype.getModuleItemPromise = function(moduleName, id, args, returnFormat) {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.getModuleItem(moduleName, id, args, (err, res, body) => {
			if (err) {
				reject({err, res, body});
			} else {
				resolve({err, res, body});
			}
		}, returnFormat);
	});
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
/**
 * [getAllObjectFromModule description]
 * @param  {[type]}   moduleName   [description]
 * @param  {Object}   args         args.limit and args.offset, args.sort, args.select
 * @param  {Function} callback     [description]
 * @param  {[type]}   returnFormat [description]
 * @return {[type]}                [description]
 */
Ria.prototype.getAllObjectFromModule = function(moduleName, args, callback, returnFormat) {
	var sorting = '';
	var select = '';
	// default values
	returnFormat = returnFormat || 'xml';
	args = args || {}
	if (!args.offset) {
		args.offset = 0;
	}
	if (!args.limit) {
		args.limit = -1;
	}
	if (!args.fulltext) {
		args.offset = '*';
	}
	if (args.sort) {
		sorting = '<sort>';
		for (var i = args.sort.length - 1; i >= 0; i--) {
			sorting += '<field fieldPath="' + args.sort[i].fieldPath + '" direction="' + args.sort[i].direction + '"/>'
		}
		sorting += '</sort>';
	}
	if (args.select) {
		select = '<select>';
		for (var i = args.select.length - 1; i >= 0; i--) {
			select += '<field fieldPath="' + args.select[i] + '"/>';
		}
		select += '</select>';
	}
	if (!args.loadThumbnailExtraSmall) {
		args.loadThumbnailExtraSmall = false;
	}
	if (!args.loadThumbnailSmall) {
		args.loadThumbnailSmall = false;
	}
	if (!args.loadThumbnailMedium) {
		args.loadThumbnailMedium = false;
	}
	if (!args.loadThumbnailLarge) {
		args.loadThumbnailLarge = false;
	}
	if (!args.loadThumbnailExtraLarge) {
		args.loadThumbnailExtraLarge = false;
	}
	if (!args.loadAttachment) { // this is the original pictures of the object
		args.loadAttachment = false;
	}
	// build the search query
	var query = '<application \
		xmlns="http://www.zetcom.com/ria/ws/module/search" \
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \
		xsi:schemaLocation="http://www.zetcom.com/ria/ws/module/search \
		http://www.zetcom.com/ria/ws/module/search/search_1_0.xsd">\
			<modules>\
				<module name="'+moduleName+'">\
				<search \
					offset="' + args.offset + '" \
					limit="' + args.limit + '" \
					loadThumbnailExtraSmall="' + args.loadThumbnailExtraSmall + '" \
					loadThumbnailSmall="' + args.loadThumbnailSmall + '" \
					loadThumbnailMedium="' + args.loadThumbnailMedium + '" \
					loadThumbnailLarge="' + args.loadThumbnailLarge + '" \
					loadThumbnailExtraLarge="' + args.loadThumbnailExtraLarge + '" \
					loadAttachment="' + args.loadAttachment + '" \
					>\
					<fulltext>' + args.fulltext + '</fulltext>\
					' + sorting + '\
					' + select + '\
				</search>\
				</module>\
			</modules>\
		</application>';
	// run the search
	return this.postModuleSearch(moduleName, query, callback, returnFormat);
}

Ria.prototype.getAllObjectFromModulePromise = function(moduleName, args, returnFormat) {
	var self = this;
	return new Promise(function(resolve, reject) {
		self.getAllObjectFromModule(moduleName, args, (err, res, body) => {
			if (err) {
				// sending all the results as one "payload object"
				reject({err, res, body});
			} else {
				// same as for reject, one object only sent back
				resolve({err, res, body});
			}
		}, returnFormat);
	});
};
