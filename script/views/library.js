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
	urlRoot: 'api/get_library_info.php',
	defaults: {
		page          :1,
		pre_page      :1,
		next_page     :1,
		total_page_num:0

	}
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
		library_info.bind('change:total', this.refresh_model_info, this);
		library_info.fetch({reset: true});
	},

	refresh_model_info: function(){
		var page    = library_info.get("page");
		this.p      = (page == undefined || page == null) ? 1 : page;
		this.total  = library_info.get('total');
		total_page_num = parseInt(parseInt(this.total)/10) + 1;

		var new_pre_page = parseInt(this.p) - 1;
		pre_page = (new_pre_page <= 1) ? 1 : new_pre_page;
		var new_next_page = parseInt(this.p) + 1;
		next_page = (new_next_page >= this.total_num) ? this.total_num : new_next_page;

		library_info.set("pre_page",pre_page);
		library_info.set("next_page",next_page);
		library_info.set("total_page_num",total_page_num);
	},

	render: function() {
		//console.log(library_info.get("total"));
		//var $el = this.$el;
		var renderedContent = this.template({
			data: library_info.toJSON()
		});
		$(this.el).html(renderedContent);
		$('#library-div-page').html($(this.el));
		//this.render_page_button();
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
		var home = 1;
		library_info.set("page",home);
		//alert('home');
	},
	pre_handle : function(e) {
		e.preventDefault();
		var pre_page = library_info.get("pre_page");
		library_info.set("page",pre_page);
		//alert('pre');
	},
	next_handle : function(e) {
		e.preventDefault();
		var next_page = library_info.get("next_page");
		library_info.set("page",next_page);
		//console.log(library_info);
		//alert('next');
	},
	last_handle : function(e) {
		e.preventDefault();
		var total_page_num = library_info.get("total_page_num");
		library_info.set("page",total_page_num);
	}
});

//pageView.refresh_model_info();

var AppView = Backbone.View.extend({
	tagName: 'div',

	id: "library-items-container",

	className: 'row-view',

	initialize: function() {
		library_info.bind('reset', this.render, this);
		library_info.bind('change', this.render, this);
		//library_info.bind('change:page', this.refresh_data, this);
		collection.bind('reset', this.render, this);
		collection.bind('change', this.render, this);
		//collection.fetch({reset: true});

		console.log(collection);

		var page = window.QueryString('page');
		var p = (page == undefined || page == null) ? 1 : page;
		library_info.set({"page":parseInt(p)});
		this.refresh_data();

		this.pageView = new LibraryPageView();
		this.pageView.refresh_model_info();
	
	},

	refresh_data: function(page) {
		var p = library_info.get("page");
		var num = 10;
		var start = (parseInt(p) - 1) * num;
		window._data = '?start=' + start + '&num=' + num;
		collection.url = 'api/get_book_list.php' + window._data;
		collection.fetch({reset: true});
		this.render();
	},
	render: function() {
		var $el = this.$el;
		collection.each(function(item) {
			var view = new LibraryItemView({
				model: item,
				collection: collection,
				id: item.get('id')
			});
			$el.append(view.render().el);

		});

		$('#library-books-list').html(this.el);
		return this;
	}
});