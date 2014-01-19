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
var nUlamdbProvider = require('./nUlamdbHandler.js').nUlamdbProvider;

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

// Setup the mongo handler. Specify local and port number.
var nUlamdbGrab = new nUlamdbProvider('127.0.0.1', 27017);



// routes
app.get('/', routes.index);

app.post('/smartGrab', function(req, res){
  console.log("Recieved :", req.body);
  var param = req.body.smartInput;

  //check if direct A###### sequence search
  if(/^A\d{6}$/.test(param)){
      param = "id:"+param;
  }

  //scrape OEIS with cheerio
  var domain = 'http://oeis.org/search?q=' + param;
  request(domain, function gotHTML(err, resp, html) {
    if (err) return console.error(err);
    var parsedHTML = $.load(html);
  
    var table710ttnums = parsedHTML('td').filter(function(i, el) {
      // integer sequence is in child of td(width=710)
      return $(this).attr('width') === '710';
    }).children().first().text();
    console.log("OEIS int sequence: ", table710ttnums);
    OEISresponse = "[" + table710ttnums + "]";

    //save new nUlamdb_item
    nUlamdbGrab.save({
        title: param,
        data: OEISresponse
    }, function( error, docs) {
         res.send(OEISresponse);
       });

  }); //end request

}); //end POST



// Start server, print out listen info
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
