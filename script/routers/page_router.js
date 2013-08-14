// This is the router used by the web served version of readium
// This router is used in the book view of the chrome extension build of readium
PageRouter = Backbone.Router.extend({

	routes: {
		"page=:page": "div_page_handle",
		""         : "div_page_handle"
	},

	div_page_handle: function(page) {
		console.info(page);
		

	window._curent_page = page;
	var current_library_request = $.ajax({
	      type: "GET",
	      url: "api/get_book_total.php",
	      data: '',
	      cache: false,
	      dataType: "text",

	      error : function(XMLHttpRequest, textStatus, errorThrown) {
	          alert('Error: '+textStatus+'\n\n'+errorThrown);
	      },

	      success : function(total, textStatus) {
	      	  	console.log(window._curent_page);
	      	  	var p         = (window._curent_page == undefined||window._curent_page == null) ? 1 : window._curent_page;
	      	  	console.log("ddd"+ p+"aaa")
				var num       = 10;
				var start     = (p - 1) * num;
				console.log("ddd"+ start+"aaa")
				window._data  = '?start=' + start + '&num=' + num;
				window._page  = p;
				window._num   = num;
				window._start = start;
				window._total = total;
	      }
	 });
	}

});