var LibraryModelPage = Backbone.Model.extend({
	defaults: {
		start : 0,
		num   : 10,
		page  : 1,
		total : 0
	}
});

var LibraryPageView = Backbone.View.extend({
	tagName: 'div',

	id: "library-div-page",

	initialize: function() {
		this.template = _.template($('#library_divpage_template').html());
	},

	render: function() {
		console.info(this.model.toJSON().title);
		var renderedContent = this.template({data: this.model.toJSON()});
		$(this.el).html(renderedContent);
		return this;
	}
});