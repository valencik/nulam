
/**
 * Module dependencies.
 */

//Standard requires for express app
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//For scraping with Cheerio
var $ = require('cheerio')
var request = require('request')

var app = express();

// all environments
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

app.get('/', routes.index);


//Cheerio grab for OEIS
function gotHTML(err, resp, html) {
  if (err) return console.error(err)
  var parsedHTML = $.load(html)

  var table710ttnums = parsedHTML('td').filter(function(i, el) {
    // integer sequence is in child of td(width=710)
    return $(this).attr('width') === '710';
  }).children().first().text()
  console.log("OEIS int sequence: ", table710ttnums);
}

var domain = 'http://oeis.org/search?q=id:A000040'
request(domain, gotHTML)


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
