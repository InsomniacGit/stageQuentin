// Set API endpoint and parameters
const apiUrl = 'https://freesound.org/apiv2';
const apiKey = 'gWrbi0mUOoh7gaZgxp1Eh5rXB1hZ4UKZ2AnV8nqo';
var audioContext = new AudioContext();
var newAudioContext;


function getSounds(queryText) {
    const url = `${apiUrl}/search/text/?query=${queryText}&token=${apiKey}`;
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


function getAllSoundsArrayBuffersAsPromises(arrayOfSoundIds) {
    const promises = arrayOfSoundIds.map(id => {
        return new Promise((resolve, reject) => {
            const url = `${apiUrl}/sounds/${id}/?token=${apiKey}`;
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const data = xhr.response;
                    const previewUrl = data.previews['preview-hq-mp3'];

                    const xhr2 = new XMLHttpRequest();
                    xhr2.open('GET', previewUrl, true);
                    xhr2.responseType = 'arraybuffer';
                    xhr2.onload = function () {
                        if (xhr2.status === 200) {
                            const arrayBuffer = xhr2.response;
                            audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
                                resolve(audioBuffer);
                            });
                        } else {
                            reject(new Error(`Request failed with status ${xhr2.status}`));
                        }
                    };
                    xhr2.onerror = function () {
                        reject(new Error('Network error'));
                    };
                    xhr2.send();
                } else {
                    reject(new Error(`Request failed with status ${xhr.status}`));
                }
            };
            xhr.onerror = function () {
                reject(new Error('Network error'));
            };
            xhr.send();
        });
    });
    return promises;
}

  
  
// Create and display buttons as sounds are loaded
function displayButtons(arrayOfSoundNames, audioBuffer, index) {       
    const playButtons = document.getElementById('playButtons');

    // wait it to be resolved before displaying the button
    audioBuffer.then((audioBuffer) => {
        console.log(audioBuffer);
        const button = document.createElement('button');
        button.innerHTML = arrayOfSoundNames[index];

        // Play sound when button is clicked
        button.addEventListener('click', () => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
        });

        // Add button to the DOM
        playButtons.appendChild(button);
    });
}


// Update progress bar, in blue color the loaded part and grey the rest
function updateProgressBar(percentage) {
    const progressBar = document.getElementById('progressBar');
    progressBar.value = percentage;

    // Si la value vaut 0 ou 100 cacher la progress bar
    if (percentage == 0 || percentage == 100) {
        progressBar.style.display = "none";
    } else {
        progressBar.style.display = "inline-block";
    }
}

  
function search() {
    // Pour reset tout les boutons
    document.getElementById('playButtons').innerHTML = '';
    
    const search = document.getElementById('search').value;
    getSounds(search).then(arrayOfSound => {

        const arrayOfSoundIds = arrayOfSound.map(sound => sound[0]);
        const arrayOfSoundNames = arrayOfSound.map(sound => sound[1]);

        // Get a list of sounds as promises
        const arrayOfPromises = getAllSoundsArrayBuffersAsPromises(arrayOfSoundIds);

        // Create and display buttons as sounds are loaded
        let loadedSounds = 0;
        arrayOfPromises.forEach((promise, index) => {
            promise.then(audioBuffer => {
                loadedSounds++;
                displayButtons(arrayOfSoundNames, promise, index);
                updateProgressBar(loadedSounds / arrayOfPromises.length * 100);
            }).catch(error => {
                console.log(error);
            });
        });
    });
}
  



var lec = true;

function lecture() {
    if (lec) {
        document.getElementById("buttonLecture").innerHTML = "Resume";
        lec = false;
        audioContext.suspend();
    } else {
        document.getElementById("buttonLecture").innerHTML = "Suspend";
        lec = true;
        audioContext.resume();
    }
}

function reset() {
    audioContext.close();
    newAudioContext = new AudioContext();
    audioContext = newAudioContext;
    lec = true;
    document.getElementById("buttonLecture").innerHTML = "Suspend";
}



// Get all the pads
var pads;

window.addEventListener("load", () => {
    pads = document.querySelectorAll(".pad");
});






    // // Add event listeners to each pad
    // pads.forEach((pad,index) => {
    //     pad.addEventListener("click", () => {

    //     // Add the "active" class to the pad
    //     pad.classList.add("active");

    //     // Remove the "active" class from the pad after a short delay
    //     setTimeout(() => {
    //     pad.classList.remove("active");
    //         }, 100);
    //     });
    // });


