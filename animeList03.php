

<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="style.css">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AnimeList v.3.0</title>
    </head>
    <body>
        <nav>
            <header>
                <h1 onClick="hideAll()">AnimeList</h1>
            </header>
            <div id="list">
                <?php
                    include "variables.php";

                    foreach($allAnimes as $i=>$animeName){
                        $vids=(glob("$folder$animeName*.mp4*"));
                        $animeName=rtrim($animeName, "/");
                        $navId=$animeName."Nav";
                        echo "<h3 id='$navId' onClick='showThis(this.innerHTML)' >$animeName</h3>";
                        echo "<ul id='$animeName' >";
                        foreach($vids as $ii=>$vid){
                            $directory=strrev(strchr(strrev($vid), "/"));
                            $epNum=str_replace(".mp4", "", str_replace($directory, "", $vid));
                            $fullpath='"'.$vid.'"';
                            $epId=$animeName.$epNum;
                            $epIdArg='"'.$animeName.$epNum.'"';
                            $animesFound[$animeName][$ii]=$epNum;
                            echo "<li id='$epId' onClick='play($fullpath, $epIdArg)'>$epNum</li>";
                        }
                        
                        echo "</ul>";
                    }
                ?>
            </div>
        </nav>
        <main>
            <video id="preview"></video>
            <div id="controls">
                <img id="back" src="images/back.png" onClick="back()"/>
                <img id="playPause" src="images/play.png" onClick="playPause()"/>
                <img id="next" src="images/next.png" onClick="next()"/>
                <span id="progress">
                    <input id="seekbar" type="range" min="1" max="100"/>
                    <canvas id="watched"/>
                </span>
                <span id="timestamp">00:00/00:00</span>
                <img id="mute" src="images/unmuted.png" onClick="mute()"/>
                <span id="volume">
                    <input id="volumebar" type="range" min="0" max="9"/>
                    <canvas id="vol"/>
                </span>
                <img id="fullscreen" src="images/fullscreen.png" onClick="fullscreen()"/>
                <span id="speed">1.0x</span>
            </div>
        </main>
        
        <script src="script.js"></script>
    </body>
</html>