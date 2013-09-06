var redis = require("redis");
var client = redis.createClient();
var fs = require('fs');
 sqlite3 = require("sqlite3");
var path = require('path');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var watchPath = '/root/all_book_library/Calibre/';
var repository = "/root/all_book_library/Calibre/metadata.db";




fs.exists(repository, function(exists) {
	if (exists) {
			var db = new sqlite3.Database(repository),
			    stmt = "select books.id,books.path,data.name from books left join data on books.id = data.book";
			db.each(stmt, function(err, row) {
				console.log(watchPath + row.path + "/" + row.name + ".epub");
			});
	};
});