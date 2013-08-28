var redis = require("redis");
var client = redis.createClient();
var fs = require('fs');
var path = require('path');
var Inotify = require('inotify').Inotify;
var inotify = new Inotify();
var spawn = require('child_process').spawn;

var watchPath = '/root/Dropbox/calibre';
var parameter = ["-m", "-r", "-q", '--timefmt', '%d/%m/%y %H:%M', '--format', '%w%f', '-e', 'moved_to,create', watchPath];
var inotifyWatch = spawn("inotifywait", parameter);


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
          var parameter = ['add' , dir  ,'--library-path', '/tmp/book'];
          calibredb = spawn("calibredb", parameter);
          calibredb.stdout.setEncoding("utf8");
          calibredb.stdout.on("data", function(data) {
              var bookid = data;
              basename = path.basename(dir);
              output  = '/tmp/test/' + basename;

              console.log(file_path);
              console.log(bookid);
              console.log(output);

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
                        client.rpush("booklist",key);
                        client.set(key,items[0]);
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