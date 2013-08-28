var redis = require("redis"),
    client = redis.createClient(),
    parseString = require('xml2js').Parser().parseString,
    http = require("http");

var PAGE_PREFIX = 'calibre_page_',
	CALIBRE_LIBRARY_TOTAL = 'calibre_library_total',
	BASE_DATA_URL = 'http://www.deliverkindle.com:8080/xml',
	PAGE_BOOK_NUMBER = 10;

exports.getBookList = function(req, res) {
	var page = (req.params.page != undefined || req.params.page != null)?req.params.page: 1;
	console.log('Retrieving page: ' + page);
	var key = PAGE_PREFIX + page;
	 client.get(key,function(err, reply){
	 	if(reply == null || err){
	 		http.get(BASE_DATA_URL + "?start=0&num=1", function(res) {
	 			res.setEncoding('utf8');
	 			res.on('data', function(data) {
	 				parseString(data, function (err, result) {
	 					var total = parseInt(result.library.$.total),
	        	    		pages = Math.ceil(total/PAGE_BOOK_NUMBER);
	        	    		p = (page >= pages) ? pages : page,
	        	    		start = (p - 1) * PAGE_BOOK_NUMBER,
	        	    		url = BASE_DATA_URL + '?start=' + start + '&num=' +       PAGE_BOOK_NUMBER;
	        	    	http.get(url, function(res) {
    						res.setEncoding('utf8');
    						res.on('data', function(data) {
    							parseString(data, function (err, result) {
    								books = result.library.book,
    								value = [];
    								for(var j=0; j<books.length; j++){
	    								var item = books[j].$;
	    								item['desc'] = books[j]._;
	    								value.push(item);
	    							}
	    							client.set(key, JSON.stringify(value));
	    							res.send(value);
    							});
    						});
    					});

	 				});
	 			});
	 		});
	 		
	 	}else{
	 		var page_content = JSON.parse(reply);
        	//console.log(page_content);
        	res.send(page_content);
	 	}
        
        //console.log(JSON.parse(reply));
   });
};


exports.updateLibraryTotal = function() {
	client.get(CALIBRE_LIBRARY_TOTAL,function(err, reply){
			if(!reply || err){
				http.get(BASE_DATA_URL + "?start=0&num=1", function(reply) {
					reply.setEncoding('utf8');
					reply.on('data', function(data) {
						parseString(data, function (err, result) {
							var total = parseInt(result.library.$.total);
							key_value = {"total":total};
							client.set(CALIBRE_LIBRARY_TOTAL, JSON.stringify(key_value));
						});
					});
				});

			}
		});

};

exports.getLibraryTotal = function(req, res) {
	client.get(CALIBRE_LIBRARY_TOTAL,function(err, reply){
		if(!reply || err){
			http.get(BASE_DATA_URL + "?start=0&num=1", function(reply) {
				reply.setEncoding('utf8');
				reply.on('data', function(data) {
					parseString(data, function (err, result) {
						var total = parseInt(result.library.$.total);
						key_value = {"total":total};
						client.set(CALIBRE_LIBRARY_TOTAL, JSON.stringify(key_value));
						res.send(key_value);
					});
				});
			});

		}else{
			var total = JSON.parse(reply);
        	res.send(total);
		}
	});

};

