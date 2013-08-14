var LibraryModelPage = Backbone.Model.extend({
	

	defaults: function() {
		return {
			start: 0,
			num: 10,
			page: 1,
			total: 0,
			page_num: 0
			//five_page_order:{page1:1,page2:2,page3:3,page4:4,page5:5}
		};
	},

	get_page_order : function() {

	}


});



var LibraryPageView = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.template = _.template($('#library_divpage_template').html());
	},
	
	render: function() {
		//var $el = this.$el;
		var renderedContent = this.template({data: this.model.get('data')});
		$(this.el).html(renderedContent);
		$('#library-div-page').html($(this.el));
		return this;
	},

	events:{
		"click #first_li_page"   : "first_handle",
		"click #last_li_page"   : "last_handle"
	},

	first_handle : function(e) {
		e.preventDefault();
		alert("first");
	},

	last_handle : function(e) {
		e.preventDefault();
		alert("last");
	}
});