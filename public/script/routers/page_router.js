// This is the router used by the web served version of readium
// This router is used in the book view of the chrome extension build of readium
PageRouter = Backbone.Router.extend({

	routes: {
		"/page/:id": "div_page_handle",
		""         : "div_page_handle"
	},

	div_page_handle: function(id) {
		var p         = (page == undefined || page == null) ? 1 : page;
		var num       = 10;
		var start     = (p - 1) * num;
		window._data  = '?start=' + start + '&num=' + num;
		window._current_page  = p;
		window._num   = num;
		window._start = start;
	}

});