// This is the namespace and initialization code that is used by
// by the library view of the chrome extension

window.Readream = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
	Utils: {},
	Init: function() {
		//var page = window.QueryString('page');
		//window.p         = (page == undefined || page == null) ? 1 : page;
	
		var App = new AppView;

		

	}
};

$(function() {
	// call the initialization code when the dom is loaded
	window.Readream.Init();
});