var assert = require('chai').assert;
var expect = require('chai').expect;
// var ria = require('../lib/ria.js');
// var fs = require('fs');

// load config vars
var config = require('./config.json')
var ria;

describe('mpRiaApi - MuseumPlus RIA API tests', function () {

  console.log(`
    Using following parameters :
      Url:      ${config.url}
      Username: ${config.username}
      Password: ${config.password}`);

  it('should create an object and set properties correctly', () => {
    var opts = {
      sessionKey: 'TEST.FILE',
      instanceUrl: config.url,
      username: config.username,
      password: config.password,
    }
    ria = require('../lib/ria.js').createInstance(opts);
    expect(ria).to.have.property('sessionKey', opts.sessionKey);
    expect(ria).to.have.property('instanceUrl', opts.instanceUrl);
    expect(ria).to.have.property('username', opts.username);
    expect(ria).to.have.property('password', opts.password);
  });

  it('should allow to set url and creditentials via functions', () => {
    var opts = {
      newUrl: 'http://www.mytesturl.com',
      newUsername: 'myNewUsername',
      newPassword: 'myNewPassword',
    }
    ria.setInstanceUrl(opts.newUrl);
    ria.setCreditentials(opts.newUsername, opts.newPassword);
  });

  it('should login on the remote API', () => {
    // create new ria object
    ria = require('../lib/ria.js');
    ria.setInstanceUrl(config.url);
    ria.setCreditentials(config.username, config.password);
    // login and check statusCode
    ria.loginPromise()
    .then(function (payload) { 
      expect(payload.res.statusCode).to.equal(200);
    })
    .catch(function (payload) { console.log('catch: ', payload.err, payload.res.statusCode); });

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
