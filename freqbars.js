const songButton = document.getElementById('play')
const inp = document.getElementById("get-files");
const songs = document.getElementById("songs")
const snacker = document.getElementById("snackbar");

let myheight = 590
let mywidth = 1275

let smth = 0.9
let bins = 1024
let strength = 150
let fval = 180
let maxx = 0
let maxval=255

let mic
let song 
let maxxspec
let fft
let state="song"

function setup(Song = `sahara`){
    createCanvas(mywidth,myheight)
    background(0)
    alerter_show()

    song = loadSound(`./MUSIC/${Song}.mp3`, success, failed, loading)

    mic = new p5.AudioIn()
    mic.start()

    fft = new p5.FFT(smth,bins)
    fft.setInput(song)
}

const success = () => {
    console.log('SUCCESS');
    snacker.innerHTML = "Tap here to play";
    snacker.onclick = () => {
        song.play();
        songButton.innerHTML = "Pause(mic)";
        alerter_hide();
    }
}

const failed = () => {
    snacker.innerHTML = "Failed to load song, reload page";
    console.log('FAILED');
}

const loading = (progress) => {
    snacker.innerHTML = `Loading... ${(progress * 100).toFixed(0)} %`;
}

function typed() {
    if (song.isPlaying()) {
        song.stop()
    }
    else {
        song.play()
        fft.setInput(song)
        songButton.innerHTML='pause(mic)'
        alerter_hide()
    }
}

function togglePlay() {
    
    if(song.isPlaying()){
        song.pause()
        songButton.innerHTML='play'
        fft.setInput(mic)
        maxval=300
        fval=100
        state = "mic"
    }
    else{
        song.play()
        songButton.innerHTML='pause(mic)'
        maxval=255
        fval=180
        state="song"
    }
}

function draw()
{
    background(0)
    strokeWeight(2)

    spectrum = fft.analyze()
    //console.log(spectrum)
    let imaxx = 0

    //check()
    maxxspec = max(spectrum)
    //console.log(maxxspec)

    for(let i=0;i<bins;i++)
    {
        let f = map(i,0,bins,1,23714)

        if(fft.getEnergy(f,f+1) >= strength)
        {
            if(maxxspec<fval) strength = maxxspec
            else strength = fval

            let x = map(i,0,bins/4,0,width)
            let y = map(spectrum[i],strength,255,height,height/2)

            colorx = map(x,0,width/2,0,255)
            colory = map(spectrum[i],strength,255,0,maxval)
            colorMode(HSB,255)
            stroke(colorx,255,colory)

            line(x,height,x,0)
        } 
    }
    maxx = imaxx
}

//HTML
//<-------------------------------->
inp.onchange = (event) => {
    console.log(event)
    song.stop()
    alerter_show()
    song = loadSound(event.target.files[0], typed, failed, loading)
    const dropdown = document.createElement("option")
    const songname = event.target.files[0].name
    dropdown.text = songname.substr(0, 8)
    songs.add(dropdown)
}

songs.oninput = (event) => {
    alerter_show()
    console.log(event.target.value)
    song.stop()
    song = loadSound(`./MUSIC/${event.target.value}.mp3`, typed, failed, loading)
}

function alerter_show() {
    snacker.className = "show"
}

function alerter_hide() {
    snacker.className = ""
}

let reset = document.getElementById('reset')

function slides(){
    fval = document.getElementById("ranges").value
    reset.innerHTML=fval
}

function resets(){
    if(state==="song") fval = 180
    else fval = 160

    reset.innerHTML=fval
    document.getElementById("ranges").value=fval
}