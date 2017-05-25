<?php

require_once "vendor/autoload.php";

Twig_Autoloader::register();
$loader = new Twig_Loader_Filesystem('templates');
$twig = new Twig_Environment($loader);

//$json = file_get_contents('data.json');
//$projects = json_encode($json);


if(isset($_GET['p'])) $template = $twig->load($_GET['p']);
else $template = $twig->load('404.html');
echo $template->render();