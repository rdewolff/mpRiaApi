# ZetCom RIA API Javascript access

The goal is to be able to access RIA api and retrieve information from there.
The data will get cached in a MongoDB database.

## Prerequists

### node.js npm libraries

- request
- xml2js
- nconf

To install all the required libraries, just use npm and run :

```
npm install
```

Et voilà!

## Usage

This is a simple usage example :

```javascript
// call the lib
var ria = require('mpRiaApi');

// set the user, pass and url
ria.setCreditentials("username", "password");
ria.setInstanceUrl("https://mp-ria-X.zetcom.com/instanceName");

// authenticate
ria._login(function() {
  // get the all the available module
  ria.getModuleList(function(err, data) {
      console.dir('\nError: ' + err);
      console.log("\nData: %j", data);
    }, 'array');
});

```

You can use a provided test file in ```/test``` folder. Please edit ```/test/config/config.json``` first.

Then you can execute the test with ```npm test```.

## Tests

### Configuration

The test configuration file is located in ```/test/test.js```. To execute it, you will have to parameter it with the config file. The config file is located in ```/test/config/config.json```. The following options are required :

1. url : the URL of the RIA application
2. username : the username
3. password : the password
4. keyfile : the keyfile where the session key will be stored
5. encoding : the character encoding to use. Default is utf8.

To run the tests, execute the following command :

```
npm test
```

It will run the basic tests.

## Questions

- How to store the api key between session and not ask a new key on every request. Maybe we want to store these information like with the usage of Dirty : https://github.com/felixge/node-dirty


## References

ZetCom RIA WebServices : http://www.zetcom.com/ria/ws/

test Web Services : http://www.getpostman.com/link/legacy_jetpacks_blog

Format XML output : http://www.freeformatter.com/xml-formatter.html
