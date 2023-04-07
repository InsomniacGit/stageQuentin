import SamplePlayer from "./SamplePlayer.js";

let audioContext = new AudioContext();
let canvas, canvasOverlay;
let ctxCanvasOverlay;

let currentPlayer = undefined;
let mousePos = { x: 0, y: 0 }

window.onload = init;

function init() {
    // called when page is loaded

    const arrayOfSoundURLs = [
        "./assets/audio/drumkits/acoustic-kit/kick.wav",
        "./assets/audio/drumkits/acoustic-kit/snare.wav",
        "./assets/audio/drumkits/acoustic-kit/hihat.wav",
        "./assets/audio/drumkits/acoustic-kit/tom1.wav",
        "./assets/audio/drumkits/acoustic-kit/tom2.wav",
        "./assets/audio/drumkits/acoustic-kit/tom3.wav"
    ];
    canvas = document.querySelector("#myCanvas");
    canvasOverlay = document.querySelector("#myCanvasOverlay");
    ctxCanvasOverlay = canvasOverlay.getContext("2d");

    arrayOfSoundURLs.forEach((url) => {
        // url, color
        addSamplePlayer(url, "#83E83E");
    });

    canvasOverlay.onmousemove = (evt) => {
        let rect = canvas.getBoundingClientRect();

        mousePos.x = (evt.clientX - rect.left);
        mousePos.y = (evt.clientY - rect.top);

        if (currentPlayer) {
            currentPlayer.highLightTrimBarsWhenClose(mousePos);
        }
    }

    canvasOverlay.onmousedown = (evt) => {
        if(currentPlayer) {
            currentPlayer.selectTrimbars();
        }
      }
      
      canvasOverlay.onmouseup = (evt) => {
        if(currentPlayer) {
            currentPlayer.releaseTrimBars();
        }
      }

    requestAnimationFrame(animate);
}

function addSamplePlayer(url, color) {
    let divTriggerButtons = document.querySelector("#triggerButtonsZone");

    const player = new SamplePlayer(audioContext, canvas, canvasOverlay, color);
    player.loadSound(url)
        .then(() => {
            let button = document.createElement("button");
            // get substring after last slash
            let name = url.substring(url.lastIndexOf("/") + 1);
            button.innerHTML = "Play " + name;
            //click listener for buttons
            button.onclick = () => {
                button.style.backgroundColor = "green";
                setTimeout(() => {
                    button.style.backgroundColor = "white";
                }, 100);
    
    
                currentPlayer = player;
                player.drawWaveform();
                player.play();
            };

            divTriggerButtons.appendChild(button);
        });
}

function animate() {
    if (currentPlayer)
        currentPlayer.drawOverlays();

    requestAnimationFrame(animate);
}
