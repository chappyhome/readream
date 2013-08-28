 var redis = require("redis"),
     client = redis.createClient(),
     parseString = require('xml2js').Parser().parseString,
     http = require("http");

 var PAGE_BOOK_NUMBER = 10,
 	 PAGE_PREFIX = 'calibre_page_',
 	 BASE_DATA_URL = 'http://www.deliverkindle.com:8080/xml';

    http.get(BASE_DATA_URL + "?start=0&num=1", function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function(data) {
	        parseString(data, function (err, result) {
	        	var total = result.library.$.total,
	        	    pages = Math.ceil(total/PAGE_BOOK_NUMBER);
        		url = BASE_DATA_URL + '?start=0' + "&num=" + total;
        			//console.log(key);
    			http.get(url, function(res) {
    				res.setEncoding('utf8');
    				res.on('data', function(data) {
    					parseString(data, function (err, result) {
    						for(var i = 1; i <= pages; i++){
    							var start = (i - 1) * PAGE_BOOK_NUMBER,
    							    key = PAGE_PREFIX + i,
	    						    books = result.library.book,
	    						    num = start + PAGE_BOOK_NUMBER,
	    						    value = [];

	    						for(var j=start; j<num; j++){
	    							if(j == total)break;
	    							var item = books[j].$;
	    							item['desc'] = books[j]._;
	    							value.push(item);
	    						}
	    						//console.log(key);
	    						//console.log(value);
	    						client.set(key, JSON.stringify(value));
    						}
    						
    						
    						

    					});
    				});
    			});


	        });
    });
    console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
	    console.log("Got error: " + e.message);
	});