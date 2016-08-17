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
    // We are using the promised version, results get packed in a payload containing
    // all variables (err, res and body).
    .then(function (payload) { 
      expect(payload.res.statusCode).to.equal(200);
    })
    .catch(function (payload) { console.log('catch: ', payload.err, payload.res.statusCode); });
  });

  it('should use a session key of 32 alphanumeric characters', () => {
    ria.login((err, res, body) => {
      expect(ria.sessionKey).to.match(/[a-z0-9]{32}/);
    });
  });

  it('should not work with a wrong session key', () => {
    ria.setSessionKey('RANDOM_WRONG_SESSION_KEY');
    ria.getAllModuleDefinition((err, res, body) => {
      expect(res.statusCode).to.equal(403);
    }); 
  })

  it('should login again when the session key has expired');

  it('should query a single object');

  it('should query multiple objects');

  it('should search');

});
