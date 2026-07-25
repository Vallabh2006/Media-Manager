<?php

function scanCSS($folder){
    $path = __DIR__ . "/../static/css/$folder";

    $files = array_filter(scandir($path), function ($file) use ($path) {
        return pathinfo($file, PATHINFO_EXTENSION) === "css"
            && is_file("$path/$file");
    });

    sort($files);

    return array_values($files);
}

$accent_files = scanCSS("accent");
$theme_files  = scanCSS("theme");
$font_files   = scanCSS("font");

?>