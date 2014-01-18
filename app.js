/**
 * nUlam - A pattern visualization tool
 * 
 * Created in a Open Volta Hackathon, Jan 2014
 * Andrew Valencik, Geoff Robb, Nate Myles
 *
 */

// dependencies
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var $ = require('cheerio')
var request = require('request')

// environment setup
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);

app.post('/smartGrab', function(req, res){
  console.log("Recieved :", req.body);
  // hardcoded OEIS grab
  var domain = 'http://oeis.org/search?q=id:A000040'
  request(domain, function gotHTML(err, resp, html) {
    if (err) return console.error(err)
    var parsedHTML = $.load(html)
  
    var table710ttnums = parsedHTML('td').filter(function(i, el) {
      // integer sequence is in child of td(width=710)
      return $(this).attr('width') === '710';
    }).children().first().text()
    console.log("OEIS int sequence: ", table710ttnums);
    res.send("[" + table710ttnums + "]");
  });
});



// Start server, print out listen info
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
