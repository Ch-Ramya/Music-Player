// Get the required elements

const wrapper = document.querySelector(".music-card-wrapper"),
    musicImg = wrapper.querySelector(".image-area img"),
    musicName = wrapper.querySelector(".song-details .song-name"),
    musicArtist = wrapper.querySelector(".song-details .artist-details"),
    playPauseBtn = wrapper.querySelector(".play-pause-container"),
    playPauseBtnIcon = playPauseBtn.querySelector(".play-pause-control"),
    prevSongBtn = wrapper.querySelector(".prev-song-control"),
    nextSongBtn = wrapper.querySelector(".next-song-control"),
    repeatBtn = wrapper.querySelector(".repeat-playlist"),
    mainAudio = wrapper.querySelector(".song-audio"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = progressArea.querySelector(".progress-bar"),
    musicCurrentTime = wrapper.querySelector(".current-time"),
    totalSongDuration = wrapper.querySelector(".total-song-duration"),
    musicList = wrapper.querySelector(".music-list"),
    showMusicListBtn = wrapper.querySelector(".more-music-control"),
    closeMusicList = musicList.querySelector(".close-icon"),
    musicListUlEle = wrapper.querySelector(".music-list-ul");


let musicIndex = Math.floor((Math.random() * allMusic.length));
progressBar.style.width = 0;


var loadMusic= function (index) {
    var musicElement = allMusic[index];
    musicName.innerHTML = musicElement.name;
    musicArtist.innerHTML = musicElement.artist;
    musicImg.src = `images/${musicElement.img}.jpg`;
    mainAudio.src = `songs/${musicElement.src}.mp3`;
}

var playMusic = function() {
    wrapper.classList.add("playing");
    playPauseBtnIcon.innerHTML= "pause";
    mainAudio.play();
}

var pauseMusic = function () {
    wrapper.classList.remove("playing");
    playPauseBtnIcon.innerHTML = "play_arrow";
    mainAudio.pause();
}

var playPauseHandler = function() {
    const isSongPaused = wrapper.classList.contains("playing");
    isSongPaused ? pauseMusic() : playMusic();
}

var nextSongHandler = function() {
    musicIndex = ((musicIndex + 1) > (allMusic.length-1)) ? 0 : (musicIndex + 1);
    loadMusic(musicIndex);
    if(wrapper.classList.contains("playing")) {
        wrapper.classList.remove("playing");
    }
    playMusic();
}

var prevSongHandler = function() {
    musicIndex = ((musicIndex - 1) < 0) ? (allMusic.length - 1) : (musicIndex-1);
    loadMusic(musicIndex);
    playMusic();
}

var updateProgressBarHandler = function (e) {
    const currentTime = e.target.currentTime;
    const songDuration = e.target.duration;
    let progressWidth = (currentTime / songDuration) * 100;
    let currentMin = Math.floor((currentTime) / 60);
    let currentSec = Math.floor((currentTime) % 60);
    if(currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerHTML = `${currentMin}:${currentSec}`;
    progressBar.style.width = `${progressWidth}%`;
}

var updateSongDurationHandler = function(e) {
    let totalMin = Math.floor((mainAudio.duration) / 60);
    let totalSec = Math.floor((mainAudio.duration) % 60);
    if(totalSec < 10){
        totalSec = `0${totalSec}`;
    }
    totalSongDuration.innerHTML = `${totalMin}:${totalSec}`;
}

var progressAreaClickHandler = function(e) {
    let progressAreaWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX/progressAreaWidth)*songDuration;
    playMusic();
}

var repeatPlaylistHandler = function(e) {
    let getRepeatMode = repeatBtn.innerText;
    switch(getRepeatMode){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
}

var handleSongRepetition = function(e) {
    let getRepeatMode = repeatBtn.innerText;
    switch(getRepeatMode){
        case "repeat":
            nextSongHandler();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex;
            do{
                randIndex = Math.floor((Math.random() * allMusic.length));
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
}

var handleShowMusicList = function() {
    musicList.classList.toggle("show");
}

var handleCloseMusicList = function() {
    showMusicListBtn.click();
}

var onSongClick = function (element) {
    var songIndex = element.getAttribute("data-song-number");
    loadMusic(songIndex);
    if(wrapper.classList.contains("playing")) {
        wrapper.classList.remove("playing");
    }
    playMusic();
}


for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li data-song-number="${i}" onclick="onSongClick(this)">
                <div class="row">
                  <span class="music-list-song-name">${allMusic[i].name}</span>
                  <p class="music-list-song-info">${allMusic[i].artist}</p>
                </div>
              </li>`;
    musicListUlEle.insertAdjacentHTML("beforeend", liTag);
}

// Add all the event listeners
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
});
playPauseBtn.addEventListener("click", playPauseHandler);
nextSongBtn.addEventListener("click", nextSongHandler);
prevSongBtn.addEventListener("click", prevSongHandler);
mainAudio.addEventListener("timeupdate", updateProgressBarHandler);
mainAudio.addEventListener("loadeddata", updateSongDurationHandler);
mainAudio.addEventListener("ended", handleSongRepetition);
progressArea.addEventListener("click", progressAreaClickHandler);
repeatBtn.addEventListener("click", repeatPlaylistHandler);
showMusicListBtn.addEventListener("click", handleShowMusicList);
closeMusicList.addEventListener("click", handleCloseMusicList);
