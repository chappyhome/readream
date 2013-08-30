Readream.module('ReadreamList', function(ReadreamList, App, Backbone, Marionette, $, _) {
	ReadreamList.Controller = function() {
		this.BookList = new App.Books.BookList();
	};

	_.extend(ReadreamList.Controller.prototype, {
		start: function(){
			console.log("show footer");
			this.showFooter();
			this.showBooksList();
			this.BookList.fetch();
		},

		showFooter: function() {
			var pager = new App.Layout.Pager({
			});
			console.log(pager);
			App.pager.show(pager);
		},
		showBooksList: function(todoList) {
			App.main.show(new BooksList.Views.ListView({
				collection : BookList
			}));
		}
	});


	ReadreamList.addInitializer(function() {
		var controller = new ReadreamList.Controller();
		console.log("addInitializer");
		controller.start();
	});
});