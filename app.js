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

// Add the Ulam Spiral to DB
app.get('/spiral', function(req, res){
  spiral_array = [401, 400, 399, 398, 397, 396, 395, 394, 393, 392, 392, 390, 389, 388, 387, 386, 385, 384, 383, 382, 381, 402, 325, 324, 323, 322, 321, 320, 319, 318, 317, 316, 315, 314, 313, 312, 311, 310, 309, 308, 307, 380, 403, 326, 257, 256, 255, 254, 253, 252, 251, 250, 249, 248, 247, 246, 245, 244, 243, 242, 241, 306, 379, 404, 327, 258, 197, 196, 195, 194, 193, 192, 191, 190, 189, 188, 187, 186, 185, 184, 183, 240, 305, 378, 405, 328, 259, 198, 145, 144, 143, 142, 141, 140, 139, 138, 137, 136, 135, 134, 133, 182, 239, 304, 377, 406, 329, 260, 199, 146, 101, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 132, 181, 238, 303, 376, 407, 330, 261, 200, 147, 102, 65, 64, 63, 62, 61, 60, 59,58, 57, 90, 131, 180, 237, 302, 375, 408, 331, 262, 201, 148, 103, 66, 37, 36, 35, 34, 33, 32, 31, 56, 89, 130, 179, 236, 301, 374, 409, 332, 263, 202, 149, 104, 67, 38, 17, 16, 15, 14, 13, 30, 55, 88, 129, 178, 235, 300, 373, 410, 333, 264, 203, 150, 105, 68, 39, 18, 5, 4, 3, 12, 29, 54, 87, 128, 177, 234, 299, 372, 411, 334, 265, 204, 151, 106, 69, 40, 19, 6, 1, 2, 11, 28, 53, 86, 127, 176, 233, 298, 371, 412, 335, 266, 205, 152, 107, 70, 41, 20, 7, 8, 9, 10, 27, 52, 85, 126, 175, 232, 297, 370, 413, 336, 267, 206, 153, 108, 71, 42, 21, 22, 23, 24, 25, 26, 51, 84, 125, 174, 231, 296, 369, 414, 337, 268, 207, 154, 109, 72, 43, 44, 45, 46, 47, 48, 49, 50, 83, 124, 173, 230, 295, 368, 415, 338, 269, 208, 155, 110, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 123, 172, 229, 294, 367, 416, 339, 270, 209, 156, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 171, 228, 293, 366, 417, 340, 271, 210, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 227, 292, 365, 418, 341, 272, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 291, 364, 419, 342, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 363, 420, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441];
  res.send(spiral_array)
});

app.post('/smartGrab', function(req, res){
  console.log("#POST Recieved :", req.body);
  var param = req.body.smartInput;
  console.log("#Searching for: ", param);

  //check if direct A###### sequence search
  if(/^A\d{6}$/.test(param)){
      param = "id:"+param;
  }

  //check database for previously stored items
  nUlamdbGrab.findAll({title: param},
    function(error, nUlamdb_items){
      console.log("#nUlamDB found : ", nUlamdb_items);
      if (nUlamdb_items.length == 0) {

        //scrape OEIS with cheerio
        var domain = 'http://oeis.org/search?q=' + param;
        console.log("#Requesting (OEIS): " + param);
        request(domain, function gotHTML(err, resp, html) {
          if (err) return console.error(err);
          var parsedHTML = $.load(html);
          var table710ttnums = parsedHTML('td').filter(function(i, el) {
            // integer sequence is in child of td(width=710)
            return $(this).attr('width') === '710';
          }).children().first().text();
          console.log("#OEIS Returned: ", table710ttnums);
          OEISresponse = "[" + table710ttnums + "]";
      
          //save new nUlamdb_item
          nUlamdbGrab.save({title: param, data: OEISresponse},
            function( error, docs){
              res.send(OEISresponse);
            }
          );
      
        }); //end request

      }
      else {
        //use nUlamdb_items  
        res.send(nUlamdb_items[0].data);
        console.log("#Sending nUlam_items: " +nUlamdb_items[0].data);
      }
    }
  );
}); //end POST



// Start server, print out listen info
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
