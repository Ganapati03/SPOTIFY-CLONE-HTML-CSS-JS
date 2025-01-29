console.log('lets write javascript')
let currentsong = new Audio();

function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "0:00"; // Handle NaN and negative values
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Ensures two-digit seconds
}

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    console.log(div)
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs")[1])
        }
    }
    return songs
}
const playMusic = (track, pause = false) => {
    currentsong.src = "/songs/" + track;
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function main() {
    let songs = await getsongs()
    playMusic(songs[0], true)
    console.log(songs)
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="img/music.svg" alt=""> <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>GANAPATI</div>
                       </div>
                       <div class="playnow">
                        <span>playnow</span>
                        <img class="invert" src="img/play.svg" alt="">
                       </div>
      </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100

    })


}
main()