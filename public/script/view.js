var ReadModel = Backbone.Model.extend({
});

var readmodel = new ReadModel();


var AppView = Backbone.View.extend({
	initialize: function() {
		readmodel.bind('reset', this.render, this);
		readmodel.bind('change', this.render, this);
		var id = window.QueryString('id');
		var nid = (id == undefined || id == null) ? 0 : id;
		console.log(nid);
		readmodel.set({"id":parseInt(nid),reset: true});
		this.refresh_data();
	},

	events:{
		"click #readerID"   : "read_click"
	},

	read_click : function(e) {
		e.stopPropagation();
		e.preventDefault();
		alert('OK');
	},

	refresh_data: function() {
		var id = readmodel.get('id');
		console.log(id);
		readmodel.url = 'api/get_doc_opf.php?id=' + id;
		console.log(readmodel.urlRoot);
		readmodel.fetch({reset: true});
		this.render();
	},
	render: function() {
		var opf = readmodel.get('opf');
		RWCDemoApp.loadAndRenderEpub(opf);
	}
});

var appview = new AppView();
