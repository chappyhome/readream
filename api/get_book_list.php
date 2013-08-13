<?php
	$start = (isset($_Request['start']))?$_Request['start']:0;
	$num = (isset($_Request['num']))?$_Request['num']:10;
	$sort = (isset($_Request['sort']))?$_Request['sort']:'';
	$order = (isset($_Request['order']))?$_Request['order']:'';
	$search = (isset($_Request['search']))?$_Request['search']:'';

	$book_list = getBookList($start, $num, $sort, $order, $search);

	$book = array();
	$books = array();
	if($book_list->book){
		foreach($book_list->book as $b){
			//$output['title']
			$attr = (array)$b->attributes();
			foreach($attr as $k=>$v){
				$book[$k] = $v;
			}
			$book = (array)$book['@attributes'];
			$book['desc'] = (string)$b;
			$books[] = $book;	
		}

	}
	echo json_encode($books);

	
	
	function getBookList($start, $num, $sort='', $order='', $search=''){

		$condition = '?start='.$start.'&num='.$num;
		if($sort) $condition .= '&sort='.$sort;
		if($order)$condition .= '&order='.$order;
		if($search)$condition .= '&search='.urlencode($search);

		$url = 'http://10.50.100.49:8080/xml'.$condition;
		$config = simplexml_load_string(file_get_contents($url));

		return $config;
	}

        
	
	
