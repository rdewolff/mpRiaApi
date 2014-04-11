/*
var asana = require('asana');

  asana.setApiKey('1NK9OUI.Qn0nrbByagb8fB2TGyOeziEN');

  asana.getUserMe(null, function(error, me){
    console.log(me)
  });
*/
var ria = require('./lib/ria.js');


ria.setCreditentials('RDW', 'RDW');
ria.setInstanceUrl('https://mp-ria-14.zetcom.com/MpWeb-ZetcomZis/')

ria._request();
