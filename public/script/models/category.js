var ReadreamModelCategory = Backbone.Model.extend({
});

var ReadreamModelCategorys = Backbone.Collection.extend({
	url: 'get_category_list',
	model: ReadreamModelCategory

});

var categorys_info = new ReadreamModelCategorys;

var ReadreamViewCategory = Backbone.View.extend({
	el : "#accordion2",

	initialize: function() {
		this.template = _.template($('#library_category_list_template').html());
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
	el: "#accordion2",

	events:{
		"click a.accordion-toggle"   : "categoryhandle"
	},

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

	categoryhandle : function(e) {
		//alert('bbb');
		e.preventDefault();
		//console.log("iiii");
		console.log($(e.currentTarget).attr("address"));
	}
});

var test = new ReadreamViewCategorys;