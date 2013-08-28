var express = require('express'),
	path = require("path"),
    api = require('./routes/api');
 
var app = express();
 
app.configure(function () {
	app.set('port', process.env.PORT || 80);
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});
 
app.get('/get_book_list/:page?', api.getBookList);
app.get('/get_library_total', api.getLibraryTotal);

setTimeout(api.updateLibraryTotal, 300000);
 
app.listen(app.get('port'));
console.log('Listening on port 80...');