#!/usr/bin/python
# -*- coding: utf-8 -*- 

import subprocess
import sqlite3
import redis
import pyinotify
from os import path,system

pool = redis.ConnectionPool(host='127.0.0.1', port=6379)  
r = redis.Redis(connection_pool=pool)

CALIBRE_PATH_EPUB_HASH = 'calibre_path_epub_hash'


wm = pyinotify.WatchManager()

class EventHandler(pyinotify.ProcessEvent):
    def process_IN_CREATE(self, evt):
        print "create ", evt.pathname
 
    def process_IN_MOVED_TO(self, evt):
        print "IN_MOVED_TO ", evt.pathname
        ext = path.splitext(evt.pathname)[1]
        if ext == '.epub':
        	dir = path.dirname(evt.pathname)
        	subbase = path.basename(dir)
        	new_dir = path.dirname(dir)
        	base  = path.basename(new_dir)
        	p = base + "/" + subbase
        	pattern = re.compile('^(.*)\s+\(\d+\)$')
		    path = pattern.match(p).groups()[0]
		    
            book_id = r.get(path)


 
 
notifier = pyinotify.Notifier(wm, EventHandler())
mask = pyinotify.IN_MOVED_TO | pyinotify.IN_CREATE
watcher = wm.add_watch("/root/Dropbox/calibre", mask, rec=True, auto_add=True)
notifier.loop()
