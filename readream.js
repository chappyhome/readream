$(function(){

var LibraryItem = Backbone.Model.extend({
	idAttribute: "key",
	getViewBookUrl: function(book) {
		return "/views/viewer.html?book=" + this.get('key');
	},

	openInReader: function() {
		window.location = this.getViewBookUrl();
	}
});


var LibraryItems = Backbone.Collection.extend({

	model: LibraryItem
	
});

//var  Library = new LibraryItems(window.ReadiumLibraryData);
current_library_request = $.ajax({
      type: "GET",
      url: "api/get_book_list.php",
      data: '',
      cache: false,
      dataType: "json",

      error : function(XMLHttpRequest, textStatus, errorThrown) {
          alert('Error: '+textStatus+'\n\n'+errorThrown);
      },

      success : function(json, textStatus) {
      	  console.log(json);
      	  var  Library = new LibraryItems(json);
      }
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


var LibraryItemsView = Backbone.View.extend({
	tagName: 'div',

	id: "library-items-container",

	className: 'row-view',

	initialize: function() {
		//this.template = Handlebars.templates.library_items_template;
		this.collection.bind('reset', this.render, this);
		//this.listenTo(this.collection, "reset", this.render);
		//this.collection.bind('add',   this.addOne, this);
	},
	render: function() {
		var collection = this.collection;
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

	restoreViewType: function() {
		// restore the setting
		if(Readium.Utils.getCookie("lib_view") === "block") {
			this.$el.addClass("block-view").removeClass("row-view");
		}
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

var  Lib_view = new LibraryItemsView({collection: Library});
Lib_view.render();

});
