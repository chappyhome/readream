var LibraryModelItem = Backbone.Model.extend({
	idAttribute: "key",
});


var LibraryModeltems = Backbone.Collection.extend({
	url: 'get_book_list',
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
	urlRoot: 'get_library_total',
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
		this.total_page_num = parseInt(parseInt(this.total)/10) + 1;

		var new_pre_page = parseInt(this.p) - 1;
		pre_page = (new_pre_page <= 1) ? 1 : new_pre_page;
		var new_next_page = parseInt(this.p) + 1;
		next_page = (new_next_page >= this.total_page_num) ? this.total_page_num : new_next_page;

		//console.log(next_page);
		//console.log(this.total_page_num);

		library_info.set("pre_page",pre_page);
		library_info.set("next_page",next_page);
		library_info.set("total_page_num",this.total_page_num);
	},

	render: function() {
		//var $el = this.$el;

		var renderedContent = this.template({
			data: library_info.toJSON()
		});
		$(this.el).html(renderedContent);
		$('#library-div-page').html($(this.el));

		var page    = library_info.get("page");
		var total_page_num    = library_info.get("total_page_num");
		//console.log(page);

		if(page == total_page_num){
			console.log("next_page");
			this.$("li:eq(2)").removeClass("active").addClass("disabled");
			this.$("li:last").removeClass("active").addClass("disabled");
		}

		if(page == 1){
			this.$("li:first").removeClass("active").addClass("disabled");
			this.$("li:eq(1)").removeClass("active").addClass("disabled");
		}
		return this;
	},

	events:{
		"click #page_home"   : "home_handle",
		"click #page_pre"    : "pre_handle",
		"click #page_next"   : "next_handle",
		"click #page_last"   : "last_handle"
	
	},

	home_handle : function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		var page = library_info.get("page");
		var home = 1;
		if(page > home){
			library_info.set("page",home);
		}
		//alert('home');
	},
	pre_handle : function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		var pre_page = library_info.get("pre_page");
		if(pre_page > 1){
			library_info.set("page",pre_page);
		}
		//alert('pre');
	},
	next_handle : function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		var next_page = library_info.get("next_page");
		var total_page_num = library_info.get("total_page_num");

		console.log("page before:" + library_info.get("page"));
		if(next_page < total_page_num){
			library_info.set("page",next_page);
		}		
		//alert('next');
	},
	last_handle : function(e) {
		e.stopPropagation();
		e.preventDefault();
		var page = library_info.get("page");
		var total_page_num = library_info.get("total_page_num");
		if(page < total_page_num){
			library_info.set("page",total_page_num);
		}
	}
});

//pageView.refresh_model_info();

var AppView = Backbone.View.extend({
	tagName: 'div',

	id: "library-items-container",

	className: 'row-view',

	initialize: function() {
		this.pageView = new LibraryPageView();
		//library_info.bind('reset', this.render, this);
		//library_info.bind('change', this.render, this);
		library_info.bind('change:total', this.pageView.refresh_model_info, this);
		//library_info.bind('change:page', this.refresh_data, this);
		collection.bind('reset', this.render, this);
		collection.bind('change', this.render, this);

		var page = window.QueryString('page');
		var p = (page == undefined || page == null) ? 1 : page;
		library_info.set({"page":parseInt(p),reset: true});
		this.refresh_data();
		
		//console.log("app:" + library_info.get("page"));
	
	},



	

	refresh_data: function(page) {
		var p = library_info.get("page");
		//var num = 10;
		//var start = (parseInt(p) - 1) * num;
		//window._data = '?start=' + start + '&num=' + num;
		collection.url = 'get_book_list/' + p;
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