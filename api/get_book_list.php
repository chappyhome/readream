<?php
	require_once "common.php";

	$start = (isset($_REQUEST['start']))?$_REQUEST['start']:0;
	$num = (isset($_REQUEST['num']))?$_REQUEST['num']:10;
	$sort = (isset($_REQUEST['sort']))?$_REQUEST['sort']:'';
	$order = (isset($_REQUEST['order']))?$_REQUEST['order']:'';
	$search = (isset($_REQUEST['search']))?$_REQUEST['search']:'';

	$book_list = getBookList($start, $num, $sort, $order, $search);

	$output = array();

	$library = array();
	$attr = (array)$book_list->attributes();
	foreach($attr as $k=>$v){
		$library[$k] = $v;
	}
	$library = isset($library['@attributes'])?(array)$library['@attributes']:array();



	$book = array();
	$books = array();
	if($book_list->book){
		foreach($book_list->book as $b){
			//$output['title']
			$attr = (array)$b->attributes();
			foreach($attr as $k=>$v){
				$book[$k] = $v;
			}
			$book = isset($book['@attributes'])?(array)$book['@attributes']:array();
			$book['desc'] = (string)$b;
			$books[] = $book;	
		}

	}

	$output['books']   = $books;
	$output['library'] = $library;


	echo json_encode($output);

	
