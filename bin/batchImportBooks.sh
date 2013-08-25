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
		if [ "${ext}" == "opf" ]; then
			dir=`dirname "${file}"`
			riqi=`date +%Y%m%d`
			echo `date +%Y-%m-%d" "%T`" "${dir} >>/data/log/${riqi}".log"	
			echo ${dir}
			r=`/usr/bin/calibredb  add  "${dir}"  --library-path /tmp/book|cut -d$'\n' -f2|sed "s%^Added book ids:\s\+\([0-9]\{0,9\}\).*$%\1%"`	
			echo ${r}
		fi
		if [ "${ext}" == "epub" ]; then
			pf=${filename%.*}
			dir=`dirname "${file}"`
			new_filename=${pf}".zip"
			f=${dir}/${new_filename}
			cp  "${file}"  "${f}"
			basename=`basename "${dir}"`
			unzipdir="/tmp/test/${basename}"
			unzip -o "${f}" -d "${unzipdir}" > /dev/null 2>&1
			
			opf=`find "${unzipdir}" -type f -name *.opf`
			#echo ${f}
			#echo ${basename}
			redis-cli set  ${r} "${opf}"
		fi
}

scandir $1
