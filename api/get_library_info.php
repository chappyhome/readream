<?php
require_once "common.php";

$book_list = getBookList(0, 1);

$attr = (array)$book_list->attributes();
foreach($attr as $k=>$v){
	$library[$k] = $v;
}
$library = isset($library['@attributes'])?(array)$library['@attributes']:array();

echo json_encode($library);