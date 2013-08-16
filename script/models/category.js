var ReadreamModelCategory = Backbone.Model.extend({
});

var ReadreamModelCategorys = Backbone.Collection.extend({
	url: 'api/get_category_info.php',
	model: ReadreamModelCategory

});

var categorys_info = new ReadreamModelCategorys;

var ReadreamViewCategory = Backbone.View.extend({
	tagName: 'ul',

	className: "dropdown-menu",

	initialize: function() {
		this.template = _.template($('#library_category_drop_template').html());
	},

	render: function() {
		var that = this;
		var $el = this.$el;
		this.collection.each(function(item) {
			var renderedContent = that.template({
				data: item.toJSON()
			});
			$el.append(renderedContent);
		});
		return this;
	}
});

var ReadreamViewCategorys = Backbone.View.extend({
	initialize: function() {
		categorys_info.bind('reset', this.render, this);
		categorys_info.bind('change', this.render, this);
		categorys_info.fetch();
		//console.log(categorys_info);
	},

	render: function() {
		var category_view = new ReadreamViewCategory({
			collection:categorys_info
		})
		$('#readream_category_list').append(category_view.render().el);
		return this;
	},

	events:{
		"change .dropdown-menu a"   : "category_handle",
	},

	category_handle : function(e) {
		//e.stopPropagation();
		//e.preventDefault();
		alert('accept');
	}
});

var test = new ReadreamViewCategorys;