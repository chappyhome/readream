<?php
function getBookList($start, $num, $sort='', $order='', $search=''){

		$condition = '?start='.$start.'&num='.$num;
		if($sort) $condition .= '&sort='.$sort;
		if($order)$condition .= '&order='.$order;
		if($search)$condition .= '&search='.urlencode($search);

		$url = 'http://api.readream.com:8080/xml'.$condition;


		$config = simplexml_load_string(file_get_contents($url));

		return $config;
	}