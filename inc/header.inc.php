<?php
session_start();
$sNomDeCettePage = strrpos($_SERVER["SCRIPT_NAME"],"/")+1;
$rootDomain = substr($_SERVER["SCRIPT_NAME"], 0, $sNomDeCettePage);
$sNomDeCettePage = substr($_SERVER["SCRIPT_NAME"], $sNomDeCettePage);
$fullDomain = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . $rootDomain;
$fullPath = $_SERVER['SCRIPT_FILENAME'];
$fullPath = str_replace($sNomDeCettePage, '', $fullPath);
$sNomDeCettePage = explode('.', $sNomDeCettePage);
$sNomDeCettePage = $sNomDeCettePage[0];

//var_dump($_SERVER, $fullDomain, 'http://site3/porte-folio_github/jeux-canevas/', $fullPath);

if(!isset($_SESSION['pseudo'])){
}else{
}
?>
<!DOCTYPE html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta charset="utf-8" />
		<!--<meta http-equiv="X-UA-Compatible" content="IE=edge" />-->
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title><?=$sPageTitle?>Jeux utilisant l'élément CANVAS de HTML5</title>
		<meta name="author" content="Eric Robert</p>" />
		<meta name="description" content="Jeux utilisant l'élément CANVAS de HTML5" />
		<meta name="keywords" content="" />
		<!-- Bootstrap core CSS -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<!-- Custom css -->
		<link rel="stylesheet" href="css/github_pages.css">
	</head>
	<body class="<?=$sNomDeCettePage?>">
		<header>
			<span>Jeux utilisant l'élément CANVAS de HTML5 - Eric Robert</span>
		</header>

		<div class="container" role="main" id="maincontent">
