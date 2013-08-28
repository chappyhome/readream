var ReadreamModelCategory = Backbone.Model.extend({
});

var ReadreamModelCategorys = Backbone.Collection.extend({
	url: 'api/get_category_info.php',
	model: ReadreamModelCategory

});

var categorys_info = new ReadreamModelCategorys;

var ReadreamViewCategory = Backbone.View.extend({
	el : "#category-list",

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
	el: "#category-list",

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
		category_view.render();
		// this.$el.on('click', function (e) {
		// 		alert($(e.currentTarget).attr("href"));
		// 	});
		return this;
	},

	events:{
		"click a"   : "category_handle"
	},

	category_handle : function(e) {
		console.log($(e.currentTarget).attr("address"));
	}
});

var test = new ReadreamViewCategorys;