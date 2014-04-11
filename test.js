

var request = require('request')

var username = 'RDW' // default is SuperAdmin
var password = 'RDW'
var options = {
  url: 'https://mp-ria-14.zetcom.com/MpWeb-ZetcomZis/ria-ws/application/session',
  //url: 'https://mp-ria-10.zetcom.com/MpWeb-prZuerichTestzentrumRBS/ria-ws/application/session',
  methode: 'GET',
  headers: {
      'Content-Type': 'application/xml',
      'Authorization': 'Basic ' + new Buffer('user['+username+']:password['+password+']').toString('base64')
      //'Authorization': 'Basic dXNlcltSRFddOnBhc3N3b3JkW1JEV10=' // RDW username and password for ZIS. This base64 chain = user[RDW]:password[RDW] 
      //'Authorization': 'Basic dXNlcltTdXBlckFkbWluXTpwYXNzd29yZFtTdXBlckFkbWluXQ==' // SuperAdmin default username and password. This base64 chain = user[SuperAdmin]:password[SuperAdmin]
  }   
}

request(options, function (err, res, body) {
  if (err) {
    console.dir(err)
    return
  }
  console.log(res.headers);
  console.dir('headers', res.headers)
  console.dir('status code', res.statusCode)
  console.dir(res.response)
  console.dir(body)

  // Debug 
  //console.dir(new Buffer(username + ':' + password).toString('base64'))
})
