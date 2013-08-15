var LibraryModelItem = Backbone.Model.extend({
	idAttribute: "key",
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
		var renderedContent = this.template({
			data: this.model.toJSON()
		});
		$(this.el).html(renderedContent);
		return this;
	}
});

var collection = new LibraryModeltems;

var library = Backbone.Model.extend({
	urlRoot: '/api/get_library_info.php',
});
var library_info = new library({
});

var LibraryPageView = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.template = _.template($('#library_divpage_template').html());
		//add event
		library_info.bind('reset', this.render, this);
		library_info.bind('change', this.render, this);
		console.log("library_info1111");
		library_info.fetch();
	},

	get_page_info: function(){
		var page    = window.QueryString('page');
		this.p      = (page == undefined || page == null) ? 1 : page;
		this.total  = library_info.get('total');
		this.total_num = parseInt(this.total/10) + 1;

		library_info.set("page", this.p);

		var new_pre_page = this.p - 1;
		this.pre_page = (new_pre_page <= 1) ? 1 : new_pre_page;
		var new_next_page = this.p + 1;
		this.next_page = (new_next_page >= this.total_num) ? this.total_num : new_next_page;

		var data = {};
		data['pre_page'] = this.pre_page;
		data['next_page'] = this.next_page;
		data['total_page'] = this.total_num;
		return data;
	},

	render: function() {
		//var $el = this.$el;
		var renderedContent = this.template({
			data: this.get_page_info()
		});
		$(this.el).html(renderedContent);
		$('#library-div-page').html($(this.el));
		//this.render_page_button();
		console.log(library_info.get('total'));
		return this;
	},

	events:{
		"click #page_home"   : "home_handle",
		"click #page_pre"    : "pre_handle",
		"click #page_next"   : "next_handle",
		"click #page_last"   : "last_handle"
	
	},

	home_handle : function(e) {
		e.preventDefault();
		//alert('home');
	},
	pre_handle : function(e) {
		e.preventDefault();
		alert('pre');
	},
	next_handle : function(e) {
		e.preventDefault();
		alert('next');
	},
	last_handle : function(e) {
		e.preventDefault();
		alert('last');
	}
});

var page = new LibraryPageView();

var AppView = Backbone.View.extend({
	tagName: 'div',

	id: "library-items-container",

	className: 'row-view',

	initialize: function() {
		console.log("HHHH");
		library_info.bind('reset', this.render, this);
		library_info.bind('change:page', this.render, this);
		collection.bind('reset', this.render, this);
		collection.bind('change', this.render, this);
		collection.fetch();
	
	},

	refresh: function(page) {
		var p = (page == undefined || page == null) ? 1 : page;
		var num = 10;
		var start = (p - 1) * num;
		window._data = '?start=' + start + '&num=' + num;
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
			$el.append(view.render().el);
			//console.log(item.get('desc'));

		});

		//console.log(library_info);
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
		$(this.el).append(view.render().el);
	},

	events: {

	}
});