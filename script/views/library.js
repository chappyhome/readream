var LibraryModelItem = Backbone.Model.extend({
	idAttribute: "key",
	getViewBookUrl: function(book) {
		return "/views/viewer.html?book=" + this.get('key');
	},

	openInReader: function() {
		window.location = this.getViewBookUrl();
	}
});


var LibraryModeltems = Backbone.Collection.extend({
	url: 'api/get_book_list.php',
	model: LibraryModelItem
	
});




var LibraryItemView = Backbone.View.extend({
	tagName: 'div',

	className: "info-wrap",

	initialize: function() {
		this.template = _.template($('#library_item_template').html());
	},

	render: function() {
		console.info(this.model.toJSON().title);
		var renderedContent = this.template({data: this.model.toJSON()});
		$(this.el).html(renderedContent);
		return this;
	}
});

var collection = new LibraryModeltems;

var LibraryItemsView = Backbone.View.extend({
	tagName: 'div',

	id: "library-items-container",

	className: 'row-view',

	initialize: function() {
		//this.template = Handlebars.templates.library_items_template;
		//_.bindAll(this, 'get_previous', 'get_next', 'render');
		//this.collection.bind('refresh', this.render);
		//this.listenTo(this.collection, "reset", this.render);
		collection.bind('reset',   this.render, this);
		collection.bind('change',   this.render, this);
		collection.fetch();
	},

	refresh: function(page){
		var p         = (page == undefined || page == null) ? 1 : page;
		var num       = 10;
		var start     = (p - 1) * num;
		window._data  = '?start=' + start + '&num=' + num;
		collection.url = collection.url + window._data;
		collection.fetch();
	},
	render: function() {
		//var collection = this.collection;
		//var content = this.template({});
		var $el = this.$el;
		//$el.html(content);
		
		//this.$('#empty-message').toggle(collection.isEmpty());

		collection.each(function(item) {
			var view = new LibraryItemView({
				model: item,
				collection: collection,
				id: item.get('id')
			});
			$el.append( view.render().el );

		});
		//this.restoreViewType();
		// i dunno if this should go here
		$('#library-books-list').html(this.el);
		return this;
	},


	addOne: function(book) {
		var view = new LibraryItemView({
			model: book,
			collection: this.collection,
			id: book.get('id')
		});
		// we are adding so this should always be hidden!
		this.$('#empty-message').toggle(false);
		$(this.el).append( view.render().el );
	},

	events: {
		
	}
});

