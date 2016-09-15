# ZetCom RIA API Javascript access

This library will enable you to access Zetcom's RIA API with Node.JS.

## Prerequists

Clone this repository and install the libraries with :

```
npm install
```

### node.js npm libraries

The following libraries will be installed :

- request
- xml2js

## Usage

This is a simple usage example :

```javascript
// call the lib
var ria = require('mpRiaApi');

// set the user, pass and url
ria.setCreditentials("username", "password");
ria.setInstanceUrl("https://mp-ria-X.zetcom.com/instanceName");

// authenticate
ria.login(function(err, res, body) {
  // get the all the available module in an array
  ria.getModuleList(function(err, data) {
      console.dir('\nError: ' + err);
      console.log("\nData: %j", data);
    }, 'array');
});
```

Have a look at the tests to see some more examples on how to use the library.

## API

To be completed.

### setCreditentials(username, password)
### setInstanceUrl(instanceUrl)
### getSessionKey()
### setSessionKey(key)
### login(callback)
### loginPromise()
### deleteSession(callback)
### getAllModuleDefinition(callback, returnFormat)
### getModuleDefinition(moduleName, callback, returnFormat)
### getModuleItem(moduleName, id, callback, returnFormat)
### getModuleOrgunits(moduleName, callback)
### getVocabularyGroup(id, callback)
### getVocabulary(id, callback)
### postModuleSearch(moduleName, searchCriteria, callback, returnFormat)
### getModuleList(callback, returnType)
### getModuleObjects(moduleName, callback)
### getModuleFields(moduleName, callback)
### getAllObjectFromModule(moduleName, args, callback, returnFormat)

args : Object with the following properties :
- offset : default 0
- limit : The max number of object to retrieve
- sorting : Array of Object containing following properties :
    + fieldPath: RIA valid fieldPath
    + direction: RIA valid direction : 'Ascending' or 'Descending'.

## Tests

The test are done using mocha and chai. You can check the subfolder ```/test``` to check all the fino.

### Configuration

The test configuration file is located in ```/test/config.json```. The following options are required :

1. url : the URL of the RIA application
2. username : the username
3. password : the password
4. keyfile : the keyfile where the session key will be stored (optional)
5. encoding : the character encoding to use. Default is utf8 (optional)

You can execute the test with ```npm run test``` or ```npm run test:watch``` for live reload.

## TODO

- Add API documentation (add description and example for each function).
- Cleanup the old tests in ```./test/test.js```.

## References

ZetCom RIA WebServices : http://www.zetcom.com/ria/ws/

test Web Services : http://www.getpostman.com/link/legacy_jetpacks_blog

Format XML output : http://www.freeformatter.com/xml-formatter.html
