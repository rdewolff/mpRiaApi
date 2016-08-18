var assert = require('chai').assert;
var expect = require('chai').expect;
// var ria = require('../lib/ria.js');
// var fs = require('fs');

// load config vars
var config = require('./config.json')
var ria;

var option = {
  sorting: {
    asc : 'Ascending',
    desc: 'Descending',
  }
}

function resetRia(ria) {
  ria = require('../lib/ria.js');
  ria.setInstanceUrl(config.url);
  ria.setCreditentials(config.username, config.password);
  return ria;
}

describe('mpRiaApi - MuseumPlus RIA API', function () {

  // extend timeout
  this.timeout(5000);

  console.log(`
    Using following parameters :
      Url:      ${config.url}
      Username: ${config.username}
      Password: ${config.password}
  `);

  it('should create an mpRiaApi object instance and set properties correctly', () => {
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
    ria = require('../lib/ria.js');
    var opts = {
      newUrl: 'http://www.mytesturl.com',
      newUsername: 'myNewUsername',
      newPassword: 'myNewPassword',
    }
    ria.setInstanceUrl(opts.newUrl);
    ria.setCreditentials(opts.newUsername, opts.newPassword);
  });

  it('should login on the remote API', (done) => {
    ria = resetRia(ria);
    // login and check statusCode
    ria.loginPromise()
    // We are using the promised version, results get packed in a payload containing
    // all variables (err, res and body).
    .then(function (payload) { 
      expect(payload.res.statusCode).to.equal(200);
      done();
    })
    .catch(function (payload) { 
      console.log('catch: ', payload.err, payload.res.statusCode);
      done(payload.err);
    });
  });

  it('should use a session key of 32 alphanumeric characters', (done) => {
    ria = resetRia(ria);
    ria.login((err, res, body) => {
      expect(ria.getSessionKey()).to.match(/[a-z0-9]{32}/);
      done();
    });
  });

  // FIXME: cannot use done() here, chai reports it's called multiple times!?
  it('should not work with a wrong session key', () => {
    ria = resetRia(ria);
    ria.setSessionKey('RANDOM_WRONG_SESSION_KEY');
    ria.getAllModuleDefinition((err, res, body) => {
      expect(res.statusCode).to.equal(403);
    }); 
  })

  it('should be possible to login again when the session key has expired', () => {
    // we will do the following to test this special use case :
    // 1. login
    // 2. invalidate the session key
    // 3. query again the system
    ria = resetRia(ria);
    ria.login((err, res, body) => {
      // login
      expect(res.statusCode).to.equal(200);
      ria.setSessionKey('RANDOM_WRONG_SESSION_KEY');
      ria.getAllModuleDefinition((err, res, body) => {
        expect(res.statusCode).to.equal(403);
        ria.login((err, res, body) => {
          expect(ria.getSessionKey()).to.match(/[a-z0-9]{32}/);
          ria.getAllModuleDefinition((err, res, body) => {
            expect(res.statusCode).to.equal(200);
          }); 
        });
      }); 
    });
  });

  it('should get all modules definitions', () => {
    ria = resetRia(ria);
    ria.login((err, res, body) => {
      ria.getAllModuleDefinition((err, res, body) => {
        // console.log('body', body.application.modules[0].module.length);
        expect(body.application.modules[0].module.length).to.be.at.least(4);
      }, 'json');
    });
  });

  it('should query a single object (Module = Object, ID = 1)', () => {
    ria = resetRia(ria);
    ria.login((err, res, body) => {
      ria.getModuleItem('Object', 1, (err, res, body) => {
        // console.log('res.statusCode', res.statusCode);
        expect(res.statusCode).to.equal(200);
        done();
      }, 'json')
    });
  });

  it('should query limited number of objects', () => {
    var limit = 5;
    ria = resetRia(ria);
    ria.login((err, res, body) => {
      ria.getAllObjectFromModule('Object', { limit: limit}, (err, res, body) => {
        //console.log('body', body.application.modules[0].module[0].moduleItem);
        expect(body.application.modules[0].module[0].moduleItem.length).to.equal(limit);
      }, 'json');
    });
  });

  it('should be able to change the order of the results', (done) => {
    var limit = 1;
    ria = resetRia(ria);
    ria.login((err, res, body) => {
      ria.getAllObjectFromModule('Object', { limit: limit, sort: [{fieldPath: '__id', direction: option.sorting.desc }]}, (err, res, body) => {
        // console.log('body', body.application.modules[0].module[0].moduleItem);
        var firstObjectId = body.application.modules[0].module[0].moduleItem[0].$.id;
        // console.log('body', body.application.modules[0].module[0].moduleItem[0].$.id);
        // console.log('body', JSON.stringify(body.application.modules[0].module[0].moduleItem));
        expect(body.application.modules[0].module[0].moduleItem.length).to.equal(limit);
        expect(firstObjectId).to.not.equal(1);
        done();
      }, 'json');
    });
  });

  it('should be able to get the standard image of an object');

  it('should be able to get the linked multimedia elements of an object');



});
