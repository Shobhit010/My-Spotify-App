console.log('Lets write some Javascript');
let currentSong = new Audio();
let songs;
let currFolder;

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


async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs ) {
        songUL.innerHTML = songUL.innerHTML + `<li class="list-decimal flex cursor-pointer border border-1 border-white mx-4 my-4 gap-9 rounded-lg">
        <img class="invert pl-2 pt-2 pb-2" src="./svg/music.svg" alt="">
        <div class="info">
            <div class="text-[70%]">${song.replaceAll("%20"," ")}</div>
            <div class="text-[70%]">Shobhit</div>
        </div>
        <div class="playNow flex justify-center items-center">
            <span class="text-[70%]">Play Now</span>
            <img class="invert pl-2 pr-2 pt-2 pb-2" src="./svg/play.svg" alt="">
        </div> </li>`;
    }

    // Attach element listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
}

const playMusic = (track, pause = false)=>{
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        play.src = "/svg/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card relative max-w-48 h-55 ml-4 mt-1 transition-all duration-200 hover:bg-[#444444] hover:rounded-lg">
            <div class="Play absolute top-[55%] left-[68%] w-12 h-12 flex items-center justify-center rounded-full bg-green-500 opacity-0 transition-all ease-out hover:opacity-100 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 text-black" height="24" viewBox="0 -960 960 960" width="24">
                  <path fill="black"  d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
                </svg>
            </div>
            <img class="rounded-[3px] p-2" src="/songs/${folder}/cover.jpg" alt="">
            <h2 class="text-sm pl-2 pt-1">${response.title}</h2>
            <p class="text-[#9A9A9A] text-[12px] pt-1 pl-2">${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`) 
            playMusic(songs[0])   
        })
    })
}

async function main(){
    // Get the list of all the songs
    await getSongs("songs/cs")
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbums()

    // Attach an event listener to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "/svg/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "/svg/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    
    // Add an event listener to seekbar 
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100 ; 
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".FirstSection").style.left = "0"
    })

    // Add an event listener for close
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".FirstSection").style.left = "-120%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", ()=>{
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if( (index-1) >= length) {
            playMusic(songs[index-1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    
    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // Add an event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("/svg/volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "/svg/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("/svg/mute.svg", "/svg/volume.svg")
            currentSong.volume = .50;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }

    })



}

main()


