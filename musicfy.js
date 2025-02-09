console.log('lets write javascript')

let currentsong = new Audio();
let songs;
let currfolder;

function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "0:00"; // Handle NaN and negative values
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Ensures two-digit seconds
}

async function getsongs(folder) {
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li> 
            <img class="invert" src="img/music.svg" alt=""> 
            <div class="info">
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
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });

}

const playMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = document.getElementsByTagName("a")
    console.log(anchors)
}
    // Array.from(anchors).forEach(e => {
    //     console.log(e.href)
        // if (element.target.href.startWith("/songs")) {
        //     console.log("element.herf")
        // }
    // });
    



async function main() {
    await getsongs("songs/ncs");
    playMusic(songs[0], true);
    console.log(songs);

    // display all albums on the page
    displayAlbums()



    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg";
        } else {
            currentsong.pause();
            play.src = "img/play.svg";
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        if (!isNaN(currentsong.duration)) {
            let currentTimeFormatted = formatTime(currentsong.currentTime);
            let durationFormatted = formatTime(currentsong.duration);
            document.querySelector(".songtime").textContent = `${currentTimeFormatted} / ${durationFormatted}`;

            // Update progress bar
            document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });
    let previous = document.querySelector("#previous");

    if (previous) {
        previous.addEventListener("click", () => {
            console.log("Previous clicked");

            // Extract the current song name correctly
            let currentSongName = decodeURIComponent(currentsong.src.split("/").pop());
            console.log("Current Song:", currentSongName);

            // Find the index of the current song in the songs array
            let index = songs.findIndex(song => song.includes(currentSongName));
            console.log("Current Song Index:", index);

            // If the song is found and there's a previous song, play it
            if (index !== -1 && index - 1 >= 0) {
                console.log("Playing Previous Song:", songs[index - 1]);
                playMusic(songs[index - 1]);
            } else {
                console.log("Beginning of Playlist or Song Not Found");
            }
        });
    }

    let next = document.querySelector("#next");

    if (next) {
        next.addEventListener("click", () => {
            console.log("Next clicked");

            // Extract the current song name correctly
            let currentSongName = decodeURIComponent(currentsong.src.split("/").pop());
            console.log("Current Song:", currentSongName);

            // Find the index of the current song in the songs array
            let index = songs.findIndex(song => song.includes(currentSongName));
            console.log("Current Song Index:", index);

            // If the song is found and there's a next song, play it
            if (index !== -1 && index + 1 < songs.length) {
                console.log("Playing Next Song:", songs[index + 1]);
                playMusic(songs[index + 1]);
            } else {
                alert("this is last song")
            }
        });
    }

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100
    })
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e);
        e.addEventListener("click", async item => {
            try {
                // Get the folder from the data attribute
                const folder = item.currentTarget.dataset.folder;

                // Get the songs for the selected folder
                const songs = await getsongs(`songs/${folder}`);

                // Log or display the songs for further handling
                console.log(songs);

                // You can add additional logic here to display songs or update UI
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        });
    });


}

main();
