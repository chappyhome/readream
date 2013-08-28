#!/bin/sh

function scandir() {
    local cur_dir parent_dir workdir
    workdir=$1
    if [ ${workdir} = "/" ]
    then
        cur_dir=""
    else
        cur_dir=$(pwd)
    fi
	
	OLDIFS=$IFS       
	IFS=:
 
    for dirlist in $( find $workdir -mindepth 2 -type d  -printf "%p$IFS")
    do
           for filelist in $( find "$dirlist" -type f -printf "%p$IFS")
		   do
				handle $filelist
		   done
    done
	IFS=$OLDIFS
}

function handle() {
		file=$1
		filename=`basename "${file}"`
		ext=${filename##*.}
		if [ "${ext}" == "epub" ]; then
			pf=${filename%.*}
			dir=`dirname "${file}"`
			new_filename=${pf}".zip"
			f=${dir}/${new_filename}
			bookid=`/usr/bin/calibredb  add  "${dir}"  --library-path /tmp/book`
			echo ${bookid}

			riqi=`date +%Y%m%d`
		    echo `date +%Y-%m-%d" "%T`" "${dir} >>/data/log/${riqi}".log"

			cp  "${file}"  "${f}"
			basename=`basename "${dir}"`
			unzipdir="/tmp/test/${basename}"
			unzip -o "${f}" -d "${unzipdir}" > /dev/null 2>&1
			
			opf=`find "${unzipdir}" -type f -name *.opf`
			sleep 10
			key="calibre_book_"${bookid}
			redis-cli rpush booklist ${key} > /dev/null 2>&1
			redis-cli set  ${key} "${opf}" > /dev/null 2>&1
		fi
}

scandir $1
