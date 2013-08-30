Readream.module('BooksList.Views', function(Views, App, Backbone, Marionette, $, _) {

	// Todo List Item View
	// -------------------
	//
	// Display an individual todo item, and respond to changes
	// that are made to the item, including marking completed.

	Views.ItemView = Marionette.ItemView.extend({
		tagName: 'li',
			template: '#template-bookView',
	});

	// Item List View
	// --------------
	//
	// Controls the rendering of the list of items, including the
	// filtering of activs vs completed items for display.

	Views.ListView = Backbone.Marionette.CompositeView.extend({
		template: '#template-bookListCompositeView',
			itemView: Views.ItemView,
			itemViewContainer: '#book-list',
	});



});
