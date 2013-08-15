var LibraryModelPage = Backbone.Model.extend({
	url:'api/get_library_info.php',
	get_page_data: function() {
		var current_page = this.get('page');
		var total_page_num = this.get('total');
		var new_pre_page = current_page - 1;
		var pre_page = (new_pre_page <= 1) ? 1 : new_pre_page;
		var new_next_page = current_page + 1;
		var next_page = (new_next_page >= total_page_num) ? total_page_num : new_next_page;

		var data = {};
		data['pre_page'] = pre_page;
		data['next_page'] = next_page;
		data['total_page'] = total_page_num;
		return data;
	}
});


var page = new LibraryModelPage({start: 0});

var LibraryPageView = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.template     = _.template($('#library_divpage_template').html());
		//add event
		//this.model.on("change:page", this.render, this);
		page.bind('reset',  this.render, this);
		page.bind('change', this.render, this);
		//page.fetch;
		//console.log(page);
		this.pre_page     = page.get_page_data().pre_page;
		this.current_page = page.get("page");
		this.next_page    = page.get_page_data().next_page;
		this.total_page   = page.get('total');
	},



	render: function() {
		//var $el = this.$el;
		var renderedContent = this.template({
			data: page.get_page_data()
		});
		$(this.el).html(renderedContent);
		$('#library-div-page').html($(this.el));
		//this.render_page_button();
		return this;
	},

	render_page_button: function() {
		if (this.current_page == 1) {
			this.$("li:first").removeClass("disabled").addClass("active");
			this.$("li:eq(1)").removeClass("disabled").addClass("active");
		} else {
			this.$("li:first").removeClass("active").addClass("disabled");
			this.$("li:eq(1)").removeClass("active").addClass("disabled");
		}

		if(this.total_page == this.current_page){
			this.$("li:last").removeClass("disabled").addClass("active");
		} else {
			this.$("li:last").removeClass("active").addClass("disabled");
		}

		if(this.next_page == this.total_page){
			this.$("li:eq(2)").removeClass("disabled").addClass("active");
		} else {
			this.$("li:eq(2)").removeClass("active").addClass("disabled");
		}


	},

	events:{
		"click #page_home"   : "home_handle",
		"click #page_pre"    : "pre_handle",
		"click #page_next"   : "next_handle",
		"click #page_last"   : "last_handle"
	
	},

	home_handle : function(e) {
		e.preventDefault();
		alert('home');
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