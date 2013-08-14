// This is the namespace and initialization code that is used by
// by the library view of the chrome extension

window.Readream = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Utils: {},
	Init: function() {
		PageRouter = new PageRouter();
		Backbone.history.start({
			pushState: false
		});
		//console.info(window._page + "uuuuuu");
		var data = (window._data == undefined) ? "?start=0&num=10" : window._data;
		window._api = "api/get_book_list.php" + data;
		//console.info(window._data);
		var current_library_request = $.ajax({
			type: "GET",
			url: window._api,
			data: '',
			cache: false,
			dataType: "json",

			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('Error: ' + textStatus + '\n\n' + errorThrown);
			},

			success: function(obj, textStatus) {
				console.log(obj);
				var books = obj.books;
				var library = obj.library;
				//console.log(library);
				var page_data = {
					start: window._start,
					num: window._num,
					page: window._current_page,
					total: parseInt(library.total),
					page_num:parseInt(library.total/window._num) + 1
				};
				//console.log(page_data);
				window._library = new LibraryModeltems(books);
				window._lib_view = new LibraryItemsView({
					collection: window._library
				});
				window._lib_view.render();
				window._divpage = new LibraryModelPage(page_data);
				window._divpage_view = new LibraryPageView({
					model: window._divpage
				});
				window._divpage_view.render();
			}
		});

	}
};

$(function() {
	// call the initialization code when the dom is loaded
	window.Readream.Init();
});