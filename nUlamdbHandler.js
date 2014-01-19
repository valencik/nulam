var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

// Sets up connection to 'nUlamDB' database
nUlamdbProvider = function(host, port) {
  this.db= new Db('nUlamDB', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

// Gets the 'nUlamdb_items' collection from database
nUlamdbProvider.prototype.getCollection= function(query, callback) {
  this.db.collection('nUlamdb_items', function(error, nUlamdb_collection){
    if( error ) callback(error);
    else callback(null, nUlamdb_collection);
  });
};

// Main grabbing function
nUlamdbProvider.prototype.findAll = function(query, callback) { 
    this.getCollection(query, function(error, nUlamdb_collection) { 
      if( error ) callback(error)
      else {
        // Parse the JSON formated string into a true JSON object
	//parsedQuery=JSON.parse(query);
        // Pass JSON object to mongo database with find() call
        nUlamdb_collection.find(query).limit(1).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    }); //end getCollection
}; //end findAll


//save new nUlamdb_item
nUlamdbProvider.prototype.save = function(nUlamdb_items, callback) {
    console.log("##nUlamDB saved :" + JSON.stringify(nUlamdb_items));
    this.getCollection(nUlamdb_items, function(error, nUlamdb_collection) {
      if( error ) callback(error)
      else {
        if( typeof(nUlamdb_items.length)=="undefined")
          nUlamdb_items = [nUlamdb_items];

        for( var i =0;i< nUlamdb_items.length;i++ ) {
          nUlamdb_item = nUlamdb_items[i];
          nUlamdb_item.created_at = new Date();
        }

        nUlamdb_collection.insert(nUlamdb_items, function() {
          callback(null, nUlamdb_items);
        });
      }
    });
};


// Allows nUlamdbProvider function to be called outside this file (in app.js)
exports.nUlamdbProvider = nUlamdbProvider;
