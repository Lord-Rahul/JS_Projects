// RAHUL VERMA 
// 23UCS087
// 13/12/2024



let currentsong = new Audio();
let songs;
let currfolder;

console.log("lets start writing java script");

async function get_song(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/Spotify/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    return songs;
}

const playmusic = async (song) => {
    currentsong.pause(); // Pause the current song before loading a new one
    currentsong.src = `/Spotify/${currfolder}/` + song;
    await currentsong.load(); // Ensure the new song is loaded before playing
    currentsong.play();
    play.src = "assets/img/pause.svg";
    document.querySelector(".song-info").innerHTML = song.replaceAll("%20", " ");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    console.log("Playing");

    currentsong.addEventListener("loadedmetadata", () => {
        console.log(currentsong.duration, currentsong.currentTime, currentsong.currentSrc);
    });
};

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function display_albums() {
    let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".card-container");

    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("songs/")) {
            let fold = e.href.split("/").slice(-2)[0];

            let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/${fold}/info.json`);
            let response = await a.json();
            cardcontainer.innerHTML += `<div class="card" data-folder="${fold}">
                                            <img src="/Spotify/songs/${fold}/cover.jpg" alt="">
                                            <h2>${response.title}</h2>
                                            <p>${response.description}</p>
                                        </div>`;
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder); // Log the folder name
            songs = await get_song(`songs/${item.currentTarget.dataset.folder}`);
            console.log(songs); // Log the songs array to check if it's undefined
            display_songs(songs); // Call the function to display songs
        });
    });
}

function display_songs(songs) {
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""; // Clear the existing list
    for (const song of songs) {
        songUL.innerHTML += `<li>
                                <img class="invert" src="assets/img/music.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                    <div> Miechal</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <img class="invert" src="assets/img/play.svg" alt="">
                                </div>
                             </li>`;
    }

    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });
}

async function main() {
    await display_albums();

    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            event.preventDefault();
            if (currentsong.paused) {
                currentsong.play();
                play.src = "assets/img/pause.svg";
            } else {
                currentsong.pause();
                play.src = "assets/img/play.svg";
            }
        }
    });

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "assets/img/pause.svg";
        } else {
            currentsong.pause();
            play.src = "assets/img/play.svg";
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = secondsToMinutesSeconds(currentsong.currentTime) + " / " + secondsToMinutesSeconds(currentsong.duration);
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", (event) => {
        const newTime = (event.offsetX / event.target.clientWidth) * currentsong.duration;
        if (!isNaN(newTime)) {
            document.querySelector(".circle").style.left = (event.offsetX / event.target.clientWidth) * 100 + "%";
            currentsong.currentTime = newTime;
        }
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        currentsong.pause();
        console.log("previous");
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`).slice(-1)[0]);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        currentsong.pause();
        console.log("next clicked");
        let index = songs.indexOf(currentsong.src.split(`/${currfolder}/`).slice(-1)[0]);
        console.log(index);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
}

main();