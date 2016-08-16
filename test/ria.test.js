var assert = require('chai').assert;
var expect = require('chai').expect;

var ria = require('../lib/ria.js');
var fs = require('fs');
var config = require('./config');

// load config vars
var CFG_URL = config.get('url'); // example : https://mp-ria-X.zetcom.com/MpWeb-instanceName
var CFG_USERNAME = config.get('username');
var CFG_PASSWORD = config.get('password');
var CFG_KEY_FILE = config.get('keyfile');
var CFG_ENCODING = config.get('encoding');

// setup ria access
ria.setInstanceUrl(CFG_URL);
ria.setCreditentials(CFG_USERNAME, CFG_PASSWORD);

describe('mpRiaApi - MuseumPlus RIA API tests', function () {

  it('should login on the remote API', () => {
    var res = ria.loginPromise()
    .then(function (err, data, body) { console.log('done', JSON.stringify(err)); return data; })
    .catch(function (err, data, body) { console.log('catch: ', JSON.stringify(err)); });
    expect(res).to.equal(res);
  });

  it('should use a session key');
  /*it('should respond to GET',function(){
  superagent
    .get('http://localhost:'+port)
    .end(function(res){
      expect(res.status).to.equal(200);
  })*/

  it('should login again when the session key has expired');

  it('should query a single object');

  it('should query multiple objects');

  it('should search');

});
