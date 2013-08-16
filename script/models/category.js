var ReadreamModelCategory = Backbone.Model.extend({
});

var ReadreamModelCategorys = Backbone.Collection.extend({
	url: 'api/get_category_info.php',
	model: ReadreamModelCategory

});

var categorys_info = new ReadreamModelCategorys;



var Test = Backbone.View.extend({
	initialize: function() {
		categorys_info.bind('reset', this.render, this);
		categorys_info.bind('change', this.render, this);
		categorys_info.fetch();
		console.log(categorys_info);
	},
	render: function() {
		console.log('OK');
		categorys_info.each(function(item) {
			console.log(item.get('name'));
		});
	}
});

var test = new Test;