import BufferLoader from './bufferLoader.js';
import createPadMaxtrix from './matrix.js';
import createWaveform from './waveform.js';
import createEffects from './effects.js';

// Set API endpoint and parameters
const apiUrl = 'https://freesound.org/apiv2';
const apiKey = 'gWrbi0mUOoh7gaZgxp1Eh5rXB1hZ4UKZ2AnV8nqo';
var audioContext = new AudioContext();


// Récupère tout les fichier dans preset1 et les met dans un tableau
const preset1 = [];
preset1.push(`audio/preset1/kick.wav`);
preset1.push(`audio/preset1/snare.wav`);
preset1.push(`audio/preset1/tom1.wav`);
preset1.push(`audio/preset1/tom2.wav`);
preset1.push(`audio/preset1/tom3.wav`);
preset1.push(`audio/preset1/hihat.wav`);

const preset2 = [];
preset2.push(`audio/preset2/kick.wav`);
preset2.push(`audio/preset2/snare.wav`);
preset2.push(`audio/preset2/tom1.wav`);
preset2.push(`audio/preset2/tom2.wav`);
preset2.push(`audio/preset2/tom3.wav`);
preset2.push(`audio/preset2/hihat.wav`);


const presetName = [];
presetName.push(`kick`);
presetName.push(`snare`);
presetName.push(`tom1`);
presetName.push(`tom2`);
presetName.push(`tom3`);
presetName.push(`hihat`);

window.onload = init;



function loadLocalFiles(preset) {
    matrix.innerHTML = '';
    createPadMaxtrix();

    bufferLoader = new BufferLoader(audioContext, preset, allSoundsLoaded, drawSound);
    bufferLoader.load();

    for (let i = 0; i < preset1.length; i++) {
        const button = document.querySelector(`#pad${i}`);
        button.textContent = presetName[i];
    }
}

function init() {
    createPadMaxtrix();
    createWaveform();
    createEffects();

    const matrix = document.getElementById("matrix");

    const search = document.getElementById('search');
    const searchButton = document.getElementById('buttonSearchWithBufferLoader');
    searchButton.onclick = testBufferLoader;

    const select = document.getElementById('selectPreset');
    select.onchange = (event) => {
        if (event.target.value === 'preset1') {
            loadLocalFiles(preset1);
            search.style.display = 'none';
            searchButton.style.display = 'none';
        } else if (event.target.value === 'preset2') {
            loadLocalFiles(preset2);
            search.style.display = 'none';
            searchButton.style.display = 'none';
        } else if (event.target.value === 'create') {
            testBufferLoader();
            search.style.display = 'inline-block';
            searchButton.style.display = 'inline-block';
        }

        // Empeche que lorsque l'on choisi un preset et que l'on appuie sur set nous retournons sur create
        select.disabled = true;
        select.disabled = false;
    };
    
}


function getSounds(queryText) {
    const url = `${apiUrl}/search/text/?query=${queryText}&token=${apiKey}&page_size=${16}`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';

    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const arrayOfSoundIdsAndNames = xhr.response.results.map(sound => [sound.id, sound.name]);
                    resolve(arrayOfSoundIdsAndNames);
                } else {
                    reject(new Error('Failed to get sounds'));
                }
            }
        };
        xhr.send();
    });
}



let bufferLoader;

function loadAllSoundSamplesWithBufferLoader(ctx, urlsToDownload, finishedLoading, drawTrack) {
    bufferLoader = new BufferLoader(
        ctx,
        urlsToDownload,
        finishedLoading,
        drawTrack
    );
    bufferLoader.load();
}

function testBufferLoader() {
    // Pour reset tout les boutons
    matrix.innerHTML = '';
    createPadMaxtrix();

    const search = document.getElementById('search').value;

    let arrayOfSoundObjectURLs = [];

    getSounds(search).then(arrayOfSoundIds => {
        arrayOfSoundIds.map((soundObject, index) => {
            const id = soundObject[0];
            const urlOfSoundObject = `${apiUrl}/sounds/${id}/?token=${apiKey}`;

            // name
            const button = document.querySelector(`#pad${index}`);
            button.textContent = soundObject[1];
            arrayOfSoundObjectURLs.push(urlOfSoundObject);
        });
        
        // use Promise.all to get all the sound objects
        Promise.all(arrayOfSoundObjectURLs.map(url => fetch(url)))
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(soundObjects => {
                // use Promise.all to get all the sound previews as mp3 files
                const arrayOfSoundPreviews = soundObjects.map(soundObject => soundObject.previews['preview-hq-mp3']);
                // console.log(arrayOfSoundPreviews);
                loadAllSoundSamplesWithBufferLoader(audioContext, arrayOfSoundPreviews, allSoundsLoaded, drawSound);
            });
    });

}

function allSoundsLoaded(bufferList) {
    // console.log("All sounds loaded");
    
    bufferList.forEach((audioBuffer, index) => {
        //console.log(audioBuffer);
        const button = document.querySelector(`#pad${index}`);

        // Play sound when button is clicked
        button.addEventListener('click', () => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
        });

        button.classList.add('set');

        // Add button to the DOM
    })
}


function drawSound(decodedBuffer, trackNumber) {
    // console.log("Draw sound : " + trackNumber);
}



// function that detects a keybord press
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    //console.log(keyName);

    switch (keyName) {
        case '1':
        case '&':
            document.querySelector('#pad12').click();
            break;
        case '2':
        case 'é':
            document.querySelector('#pad13').click();
            break;
        case '3':
        case '"':
            document.querySelector('#pad14').click();
            break;
        case '4':
        case "'":
            document.querySelector('#pad15').click();
            break;
        case 'A':
        case 'a':
            document.querySelector('#pad8').click();
            break;
        case 'Z':
        case 'z':
            document.querySelector('#pad9').click();
            break;
        case 'E':
        case 'e':
            document.querySelector('#pad10').click();
            break;
        case 'R':
        case 'r':
            document.querySelector('#pad11').click();
            break;
        case 'Q':
        case 'q':
            document.querySelector('#pad4').click();
            break;
        case 'S':
        case 's':
            document.querySelector('#pad5').click();
            break;
        case 'D':
        case 'd':
            document.querySelector('#pad6').click();
            break;
        case 'F':
        case 'f':
            document.querySelector('#pad7').click();
            break;
        case 'W':
        case 'w':
            document.querySelector('#pad0').click();
            break;
        case 'X':
        case 'x':
            document.querySelector('#pad1').click();
            break;
        case 'C':
        case 'c':
            document.querySelector('#pad2').click();
            break;
        case 'V':
        case 'v':
            document.querySelector('#pad3').click();
            break;
    }

});
