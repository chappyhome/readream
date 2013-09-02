var redis = require("redis"),
    client = redis.createClient(),
    parseString = require('xml2js').Parser().parseString,
    http = require("http"),
    fs = require('fs'),
    path = require('path'),
    Inotify = require('inotify').Inotify,
    inotify = new Inotify(),
    spawn = require('child_process').spawn,

    watchPath = '/root/Dropbox/calibre',
    parameter = ["-m", "-r", "-q", '--timefmt', '%d/%m/%y %H:%M', '--format', '%w%f', '-e', 'moved_to,create', watchPath],
    inotifyWatch = spawn("inotifywait", parameter);


var PAGE_BASIC_INFO = 'calibre_page_basic_info',
    BASE_DATA_URL = 'http://www.deliverkindle.com:8080/xml',
    EPUB_UNZIP_CONTENT = '/var/www/html/epub_content/',
    //BOOK_LIBRARY = '/tmp/book';
    BOOK_LIBRARY = '/root/all_book_library/Calibre';


inotifyWatch.stdout.setEncoding("utf8");
inotifyWatch.stdout.on("data", function(data) {
  var lines = data.split("\n");
  for(var i=0; i < lines.length; i++){
      var line = lines[i].trim();
      if (line.length == 0) continue;
      var ext = path.extname(line);
      if(ext == '.epub'){
          var dir = path.dirname(line);
          var file_path = line;
          var parameter = ['add' , dir  ,'--library-path', BOOK_LIBRARY];
          calibredb = spawn("calibredb", parameter);
          calibredb.stdout.setEncoding("utf8");
          calibredb.stdout.on("data", function(data) {
              var bookid = data;
              basename = path.basename(dir);
              output  = EPUB_UNZIP_CONTENT + basename;

              console.log(file_path);
              console.log(bookid);
              console.log(output);

              if(bookid != undefined || bookid != null){
                    client.get(PAGE_BASIC_INFO,function(err, reply){
                      if(reply != undefined || reply != null){
                           var basic_obj = JSON.parse(reply),
                               total = basic_obj.total||0,
                               //total = 951;
                               num = basic_obj.num||10,
                               pages = basic_obj.pages||0,
                               page_prefix = basic_obj.page_prefix||"calibre_page_";
                           basic_obj.total = total + 1;
                           basic_obj.pages  = Math.ceil(basic_obj.total/num);
                           client.set(PAGE_BASIC_INFO, JSON.stringify(basic_obj));

                           //update
                           var before_total = total - 1;
                           var url = BASE_DATA_URL + "?start=" + before_total +  "&num=1";
                           console.log(url);
                           http.get(url, function(res) {
                              res.setEncoding('utf8');
                              res.on('data', function(data) {
                                    parseString(data, function (err, result) {
                                      console.log(result);
                                      var book = result.library.book[0];
                                      if(book != null){
                                          var item = book.$;
                                              item['desc'] = book._;
                                          var last_page = page_prefix + basic_obj.pages;
                                          client.get(last_page,function(err, reply){
                                              if(reply != undefined || reply != null){
                                                 var page_item = JSON.parse(reply);
                                                 page_item.push(item);
                                               }else{
                                                  var page_item = [];
                                                  page_item.push(item);
                                               }
                                               client.set(last_page, JSON.stringify(page_item));
                                          });
                                        }

                                  });
                              
                              });

                          });
                      }
                    });
              }

              var parameter = ['-o' , file_path  ,'-d', output];
              unzip = spawn("unzip", parameter);
              unzip.stdout.setEncoding("utf8");
              unzip.stdout.on("close", function(data) {
                  var parameter = [output , '-type'  ,'f', '-name', '*.opf'];
                  find = spawn("find", parameter);
                  find.stdout.setEncoding("utf8");
                  find.stdout.on("data", function(data) {
                      var items = data.split("\n");
                      if(items.length>0){
                        key = "calibre_book_" + bookid;
                        client.rpush("booklist1",key);
                        var value = items[0].replace(/\/var\/www\/html\//,"");
                        client.set(key,value);
                      }
                      
                  });
              });
          });
      }
    //console.log(line);
    //console.log(ext);
  }
  
});

//display error
inotifyWatch.stderr.setEncoding("utf8");
inotifyWatch.stderr.on("data", function(data) {
  console.log(data);
});