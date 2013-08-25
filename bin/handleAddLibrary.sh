#!/bin/sh
src=/root/Dropbox/calibre
/usr/bin/inotifywait -mrq --timefmt '%d/%m/%y %H:%M' --format  '%w%f'  -e moved_to,create ${src}  | while read  file
        do
		filename=`basename "${file}"`
		ext=${filename##*.}
		if [ "${ext}" == "opf" ]; then
			dir=`dirname "${file}"`
			riqi=`date +%Y%m%d`
			echo `date +%Y-%m-%d" "%T`" "${dir} >>/data/log/${riqi}".log"	
			echo ${dir}
			r=`/usr/bin/calibredb  add  "${dir}"  --library-path /root/newbook|cut -d$'\n' -f2|sed "s%^Added book ids:\s\+\([0-9]\{0,9\}\).*$%\1%"`
			
			echo ${r}
		fi
		if [ "${ext}" == "epub" ]; then
			pf=${filename%.*}
			dir=`dirname "${file}"`
			new_filename=${pf}".zip"
			f=${dir}/${new_filename}
			cp  "${file}"  "${f}"
			basename=`basename "${dir}"`
			unzipdir="/var/www/html/epub_content/${basename}"
			unzip -o "${f}" -d "/var/www/html/epub_content/${basename}" > /dev/null 2>&1
			#redis-cli rpush book_list "${basename}"
			opf=`find "${unzipdir}" -type f -name *.opf`
			redis-cli set  ${r} "${opf}"
		fi
        done
