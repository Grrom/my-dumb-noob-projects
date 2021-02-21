
console.log('console.log(hahaha)');

//===================================================//
//                     WARNING                       //
//---------------------=======-----------------------//
//              SPAGHETTI CODE AHEAD                 //
//              READ AT YOUR OWN RISK                //
//===================================================//


//====================================     X M L H T T P R E Q U E S T
function xhr(url, cFunction){
    let xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState == 4 && this.status == 200){
            cFunction(this);
        }
    }
    xhttp.open('GET', url, true);
    xhttp.send();
}

//====================================     V A R I A B L E S

    const pv=document.getElementById('preview');
    const seekbar=document.getElementById('seekbar');
        const watched=document.getElementById('watched');
    const volumebar=document.getElementById('volumebar');
        const vol=document.getElementById('vol');
    const playButton=document.getElementById('playPause');
    const muteButton=document.getElementById('mute');
    const speed=document.getElementById('speed');
    const h3s=document.getElementsByTagName('ul');

    let animeList={};

    let watchedArr={};
    let watchedAnime={};
    let lastViewed={};
    let selectedEp='';
    let cookieArr;

//====================================     C A L L S

window.onload=function(){
    xhr('listOfAnimes.php', getAnimeList);
    if(document.cookie.length>0){
        cookieArr=JSON.parse(document.cookie);
        for(let i=0;i<cookieArr.length;i++){
            switch(cookieArr[i].objName){
                case 'watchedArr':
                    watchedArr=cookieArr[i];
                    break;
                case 'lastViewed':
                    lastViewed=cookieArr[i];
                    break;
                case 'watchedAnime':
                    watchedAnime=cookieArr[i];
                    break;
                default:
                    animeList=cookieArr[i];
            }
        }
        recolorFinished();
        loadLastViewed();
        showWatched();
    }else{
        alert('cookies deleted');
        watchedArr = {'objName' : 'watchedArr'};
        lastViewed= {'objName' : 'lastViewed'};
        watchedAnime= {'objName': 'watchedAnime'};
        for(let i=0;i<animeList['titles'].length;i++){
            watchedArr[animeList['titles'][i]] = [];
        }
    }
    
    volumeFunc();
    timeUpdateFunc();
}

function getAnimeList(xhr){
    animeList = JSON.parse(xhr.responseText);
}



//====================================     L I S T E N E R
window.onkeyup=function(){
    if(event.key===' '){
        this.playPause();
    }
    if(event.key==='f'){
        this.fullscreen();
    }
    if(event.key===','){
        this.back();
    }
    if(event.key==='.'){
        this.next();
    }
    if(event.key==='0'){
        pv.currentTime+=88;
        watched.style.width=(seekbar.max*pv.currentTime)/pv.duration+'%';
        seekbar.value=seekbar.max*pv.currentTime/pv.duration;
    }
    if(event.key==='r'){
        pv.currentTime=0;
        watched.style.width=(seekbar.max*pv.currentTime)/pv.duration+'%';
        seekbar.value=seekbar.max*pv.currentTime/pv.duration;
    }
    if(event.key==='='){
        pv.playbackRate+=.1;
        speed.innerHTML=pv.playbackRate.toFixed(1);
    }
    if(event.key==='-'){
        pv.playbackRate-=.1;
        speed.innerHTML=pv.playbackRate.toFixed(1);
    }
    if(event.key==='+' || event.key==='_'){
        pv.playbackRate=1.0;
        this.updateSpeed();
    }
}

window.onkeydown=function(){
    if(this.event.key==='ArrowUp'){
        volumebar.value++;
        volumeFunc(); 
    }
    if(this.event.key==='ArrowDown'){
        volumebar.value--;
        volumeFunc();
    }
    if(this.event.key==='ArrowLeft'){
        pv.currentTime-=1;
        watched.style.width=(seekbar.max*pv.currentTime)/pv.duration+'%';
        seekbar.value=seekbar.max*pv.currentTime/pv.duration;
    }
    if(this.event.key==='ArrowRight'){
        pv.currentTime+=1;
        watched.style.width=(seekbar.max*pv.currentTime)/pv.duration+'%';
        seekbar.value=seekbar.max*pv.currentTime/pv.duration;
    }
}

pv.ontimeupdate=function(){
    timeUpdateFunc();

    let folder=getFolder();
    
    watchedAnime[folder]={
        'epId':selectedEp,
        'src':pv.src,
        'time':pv.currentTime
    }
}

pv.onended=function(){
    showWatched();
    next();
    playButton.src='images/pause.png';
}

pv.onclick=function(){
    playPause();
}

pv.onfullscreenchange=function(){
    if(pv.controls===false){
        pv.controls=true;
    }else{
        pv.controls=false;
    }
}

seekbar.onchange=function(){
    pv.currentTime=pv.duration*seekbar.value/seekbar.max;
}

seekbar.onmousedown=function(){
    pv.pause();
}

seekbar.onmouseup=function(){
    playPause();
}

seekbar.onseeking=function(){
    pv.currentTime=pv.duration*seekbar.value/seekbar.max;
}

volumebar.addEventListener('change', volumeFunc);
function volumeFunc(){
    if(volumebar.value==0){
        muteButton.src='images/muted.png';
    }else{
        muteButton.src='images/unmuted.png';
    }
    pv.volume='.'+volumebar.value;
    vol.style.width=volumebar.value+'0%';
}

window.addEventListener('beforeunload', beforeUnloadFunc);
function beforeUnloadFunc(){
    lastViewed={
        'objName':'lastViewed',
        'epId':selectedEp,
        'src':pv.src,
        'time':pv.currentTime
    }
    watchedAnime['objName']='watchedAnime';
    //deleteEntries('');

    let forCookie=[watchedArr, lastViewed, watchedAnime, animeList];
    forCookie=JSON.stringify(forCookie);
    document.cookie = forCookie+'; expires=Thu, 18 Dec 6969 12:00:00 UTC; path=/';
    console.log('cookies saved')

}
//====================================     F U N C T I O N S
function loadLastViewed(){
    pv.src=lastViewed.src;
    try{
        pv.currentTime=lastViewed.time;
    }catch(e){
        pv.currentTime=0;
    }
    
    selectedEp=lastViewed.epId;
    updateTime();
    let folder=getFolder();
    recolorTitle(folder);
    pv.pause;
}

function showWatched(){
    let folder = getFolder();
    for(let i=0; i<watchedArr[folder].length; i++){
        try{
            document.getElementById(watchedArr[folder][i]).style.backgroundColor='inherit';
        }catch(e){
            console.log('added watchedArr deleted')
            watchedArr[folder]='d';
        }
    }
    try{
        document.getElementById(selectedEp).style.backgroundColor='#ccccff';
    }catch(e){
        console.log(selectedEp+" has been deleted");
    }
    volumeFunc();
}

function timeUpdateFunc(){
    seekbar.value=seekbar.max*pv.currentTime/pv.duration;
    updateTime();
    if(pv.currentTime>0){
        pv.onloadeddata=function(){
            watched.style.width=(seekbar.max*pv.currentTime)/pv.duration+'%';
        }
        if(pv.paused===false){
            watched.style.width=(seekbar.max*pv.currentTime)/pv.duration+'%';
        }
    }
}

function play(sauce, id){

    changeSelected(id);

    pv.src=sauce;  
    addToWatchedArr();
    playPause();
}

function addToWatchedArr(){
    let folder=getFolder();
    let alreadyExists=false;
    for(let i=0; i<watchedArr[folder].length; i++){
        if(watchedArr[folder][i]===selectedEp){
            alreadyExists=true;
            console.log("meron na")
        }
    }
    if(alreadyExists===false){
        console.log("added to watchedArr: "+selectedEp)
        watchedArr[folder].push(selectedEp);
    }
}

function changeSelected(id){
    if(selectedEp===''){
        selectedEp=id;
    }
    try{
        document.getElementById(selectedEp).style.backgroundColor='inherit';
        selectedEp=id;
        document.getElementById(selectedEp).style.backgroundColor='#ccccff';
    }catch(e){
        console.log(selectedEp+" has been deleted");
    }
}

function showThis(title){
    hideAll();
    recolorTitle(title);

    try{
        changeSelected(watchedAnime[title].epId);
        pv.src=watchedAnime[title].src;  
        pv.currentTime=watchedAnime[title].time;
    }catch(e){
        changeSelected(title+animeList[title][0]);
        pv.src='anime/'+title+'/'+animeList[title][0];
    }
    addToWatchedArr();
    showWatched();
    
    playButton.src='images/play.png';
    pv.pause;
}

function recolorTitle(title){
    let id=title+'Nav';
    try{
        if(document.getElementById(title).style.display==='flex'){
            document.getElementById(title).style.display='none';
            document.getElementById(id).style.backgroundColor= 'inherit';
        }else{
            document.getElementById(title).style.display='flex';
            document.getElementById(id).style.backgroundColor= '#007ae6';
        }
    }catch(e){
        selectedEp='';
        alert('last entry has been deleted')
    }
}

function hideAll(){
    for(let i=0; i<h3s.length; i++){
        document.getElementById(h3s[i].id).style.display='none';
        let id=h3s[i].id+'Nav';
        document.getElementById(id).style.backgroundColor= 'inherit';
    }
    recolorFinished();
    /*for(let i=0; i<h3s.length; i++){
        if(watchedArr[h3s[i].id].length===animeList[h3s[i].id].length){
            let id=h3s[i].id+'Nav';
            document.getElementById(id).style.opacity= '50%';
        }
    }*/
}

function recolorFinished(){
    for(let i=0; i<h3s.length; i++){
        let id=h3s[i].id+'Nav';
        try{
            if(watchedArr[h3s[i].id].length===animeList[h3s[i].id].length){
                document.getElementById(id).style.opacity= '50%';
            }
        }catch(e){
            console.log("something wrong with- " + h3s[i].id)
            watchedArr[h3s[i].id]=[];
        }
    }
}

function updateTime(){

    let current=new Date(null);
    current.setSeconds(pv.currentTime);
    let secs=current.toString().substring(19, 25);

    let duration=new Date(null);
    duration.setSeconds(pv.duration);
    let dur=duration.toString().substring(19, 25);
    document.getElementById('timestamp').innerHTML=secs+'/'+dur;
}

function deleteEntries(name){
    let folder = getFolder();
    for(let i=0;i<watchedArr[folder].length;i++){
        if(watchedArr[folder][i].substring(0, watchedArr[folder][i].length-2)===name){
            delete watchedArr[folder][i];
        }
    }
}

function updateSpeed(){
    speed.innerHTML=pv.playbackRate.toFixed(1);
}

function getFolder(){
    let folder=pv.src.toString().substr(36);
    folder=folder.substring(0, folder.indexOf('/'));
    while(folder.indexOf('%20')>0)folder=folder.replace('%20', ' ');
    return folder;
}

//====================================     C O N T R O L S
function playPause(){
    if(pv.paused){
        playButton.src='images/pause.png';
        pv.play();
    }else{
        playButton.src='images/play.png';
        pv.pause();
    }
}

function next(){
    folder=getFolder();
    let index=0;
    let compareTo=selectedEp.replace('%', ' ').replace(folder, '');
    for(index=0;index<animeList[folder].length; index++){
        if(animeList[folder][index]==compareTo){
            break;
        }
    }
    if(index+1>=animeList[folder].length)index-=1;
    let newSauce=animeList[folder][index+1].replace(' ', '%20');
    newSauce='anime/'+folder+'/'+newSauce+'.mp4';
    pv.src=newSauce;
    changeSelected(folder+animeList[folder][index+1]);
    addToWatchedArr();
    updateSpeed();
    playPause();
    recolorFinished();
}

function back(){
    let folder=getFolder();
    let index=0;
    let compareTo=selectedEp.replace('%', ' ').replace(folder, '');
    for(index=0;index<animeList[folder].length; index++){
        if(animeList[folder][index]==compareTo){
            break;
        }
    }
    if(index===0)index+=1;
    let newSauce=animeList[folder][index-1].replace(' ', '%20');
    newSauce='anime/'+folder+'/'+newSauce+'.mp4';
    pv.src=newSauce;
    changeSelected(folder+animeList[folder][index-1]);
    updateSpeed();
    playPause();
}

function fullscreen(){
    pv.requestFullscreen();
}

function mute(){
    if(pv.muted){
        muteButton.src='images/unmuted.png';
        vol.style.backgroundColor='#007ae6';
        pv.muted=false;
    }else{
        muteButton.src='images/muted.png';
        vol.style.backgroundColor='#a1a1a1';
        pv.muted=true;
    }
}


//cookies
function setCookie(name, value){
    document.cookie=name+'='+value+'; expires=Thu, 01 Jan 6969 00:00:00 UTC; path=/';
}