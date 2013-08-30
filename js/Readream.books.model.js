Readream.module('Books', function(Books, App, Backbone, Marionette, $, _) {
  
	Books.Book = Backbone.Model.extend({
	});


	Books.BookList = Backbone.Collection.extend({
		url: "api/get_book_list.php",
		model: Books.Book
	});

});
