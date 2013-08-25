<?php
function getBookList($start, $num, $sort='', $order='', $search=''){

	global $book_list_url;
	$condition = '?start='.$start.'&num='.$num;
	if($sort) $condition .= '&sort='.$sort;
	if($order)$condition .= '&order='.$order;
	if($search)$condition .= '&search='.urlencode($search);

	$url = $book_list_url.$condition;


	$config = simplexml_load_string(file_get_contents($url));

	return $config;
}