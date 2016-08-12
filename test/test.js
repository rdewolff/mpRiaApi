// lib
var ria = require('../lib/ria.js');
var fs = require('fs');
var config = require('./config');
var async = require('asyncawait/async'); // async & promises
var await = require('asyncawait/await');
var Promise = require('bluebird');

// load config vars
var CFG_URL = config.get('url'); // example : https://mp-ria-X.zetcom.com/MpWeb-instanceName
var CFG_USERNAME = config.get('username');
var CFG_PASSWORD = config.get('password');
var CFG_KEY_FILE = config.get('keyfile');
var CFG_ENCODING = config.get('encoding');

// setup ria access
ria.setInstanceUrl(CFG_URL);
ria.setCreditentials(CFG_USERNAME, CFG_PASSWORD);

var res = await(ria.loginAsync());
console.log('Login result: ' + res);
runMyTests();

// try to read the session file containing the session key
/*fs.readFile(CFG_KEY_FILE, CFG_ENCODING, function(err, data){
	// login if no session file
	if (err) {
		console.time('login');
		ria._login(function(){

			console.timeEnd('login');
			// try to reuse session to avoid re-login on every request
			// on login, save the key to the file
			fs.writeFile(CFG_KEY_FILE, ria.getSessionKey(), CFG_ENCODING, null);
			console.log("SAVE KEY " + ria.getSessionKey())
			// ria.deleteSession(runMyTests); // test delete session
			runMyTests();
		});
	// there is session key we can retrieve
	} else {
		// retrieved key can be wrong or not valid anymore
		ria.setSessionKey(data);
		console.log("RETRIEVED KEY " + ria.getSessionKey())

		// ria.deleteSession(runMyTests); // test delete session
		runMyTests();
	}

});*/


function runMyTests() {

	// ************************************************************************
	// * Standard function tests
	// ************************************************************************

	ria.getModuleDefinition('Multimedia', callback);
	//ria.getModuleDefinition('Object', callback);

	//ria.getAllModuleDefinition(callback);

	//ria.getModuleItem('Multimedia', '446', callback); // TODO not working
	//ria.getModuleItem('Multimedia', 'MulAltimaCreationdate0043Txt', callback); // TODO not working
	//ria.getModuleItem('Multimedia', 84, callback); // TODO not working, ID? How to find them? With the search :)
	// ria.getModuleItem('Object', '65', callback);

	//ria.getModuleOrgunits('Multimedia', callback); // OK

	/*
	<repeatableGroup name="MulLine0043Grp">
		<repeatableGroupItem>
			<vocabularyReference name="LineVoc" id="425" />
		</repeatableGroupItem>
	</repeatableGroup>
    */
	// ria.getVocabularyGroup('425', callback); // OK 50% : returned XML seems INVALID ?
	// ria.getVocabularyGroup('397', callback);
	// ria.getVocabularyGroup(373, callback); // OK

	// ria.getVocabulary('3676', callback); // OK
	// ria.getVocabulary(3139, callback); // OK

	// Body definition : http://www.zetcom.com/ria/ws/module/search/search.xml
	// OK!
	// ria.postModuleSearch('Multimedia', '<application xmlns="http://www.zetcom.com/ria/ws/module/search" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.zetcom.com/ria/ws/module/search http://www.zetcom.com/ria/ws/module/search/search_1_0.xsd"><modules><module name="Multimedia"><search><fulltext>*</fulltext></search></module></modules></application>', callback);



	// ************************************************************************
	// * Custom function tests
	// ************************************************************************
	//console.time('runMyTests');

	// get all the module
	//ria.getModuleList(callback, 'array');

	// get all the fields, type, groups, voc, etc.. from a specified module
	//ria.getModuleDefinition('Object', callback);

	// TODO how to list all object in a given module? Only via a search?
	//ria.postModuleSearch('Object', '<application xmlns="http://www.zetcom.com/ria/ws/module/search" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.zetcom.com/ria/ws/module/search http://www.zetcom.com/ria/ws/module/search/search_1_0.xsd"><modules><module name="Object"><search><fulltext>*</fulltext></search></module></modules></application>', callback);
	//ria.getModuleObjects('Object');



	// ria.getModuleFields('Object');

	// Complete test
	//ria.getModuleItem('Object', '65', callback);
	//ria.getAllObjectFromModule('Object', callback, 'json');

}


function callback(err, data) {
	// console.timeEnd('runMyTests');
    if (err)  console.dir(err);
    if (data) console.log("Data: %j", data); // show all json format

}
