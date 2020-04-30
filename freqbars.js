var myheight = 590
var mywidth = 1275

var smth = 0.9
var bins = 1024
var strength = 150
var fval = 180
var maxx = 0
var maxval=255

var mic
var song 
var maxxspec
var fft
var state="song"

function setup(Song = `sahara`){
    createCanvas(mywidth,myheight)
    background(0)

    song = loadSound(`./MUSIC/${Song}.mp3`,togglePlay)

    mic = new p5.AudioIn()
    mic.start()

    fft = new p5.FFT(smth,bins)
    fft.setInput(song)
}

function togglePlay() {
    let songButton = document.getElementById('plays')
    
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
        songButton.innerHTML='pause'
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
    var imaxx = 0

    //check()
    maxxspec = max(spectrum)
    //console.log(maxxspec)

    for(var i=0;i<bins;i++)
    {
        var f = map(i,0,bins,1,23714)

        if(fft.getEnergy(f,f+1) >= strength)
        {
            if(maxxspec<fval) strength = maxxspec
            else strength = fval

            var x = map(i,0,bins/4,0,width)
            var y = map(spectrum[i],strength,255,height,height/2)

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
function search(){
    let str = document.getElementById('types').value
    song.stop()
    console.log(str)
    setup(str)
}

let reset = document.getElementById('reset')

function slides(){
    fval = document.getElementById("ranges").value
    reset.innerHTML=fval
    console.log(fval)
}

function resets(){
    if(state==="song") fval = 180
    else fval = 160

    reset.innerHTML=fval
    document.getElementById("ranges").value=fval
}