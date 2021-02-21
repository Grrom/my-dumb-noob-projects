<?php

    $folder="anime/";
    $dirs=glob("$folder**");
    foreach($dirs as $i=>$dir){
        $allAnimes[$i]=ltrim(strchr($dir, "/"), "/")."/";
    }
    foreach($allAnimes as $i=>$animeName){
        $vids=(glob("$folder$animeName*.mp4*"));
        $animeName=rtrim($animeName, "/");
        $animesFound["titles"][$i]=$animeName;
        foreach($vids as $ii=>$vid){
            $directory=strrev(strchr(strrev($vid), "/"));
            $epNum=str_replace(".mp4", "", str_replace($directory, "", $vid));
            $animesFound[$animeName][$ii]=$epNum;
        }
    }

?>