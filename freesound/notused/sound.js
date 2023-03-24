var bufferLoader;

function loadAllSoundSamples() {
    bufferLoader = new BufferLoader(
        context,
        currentSong.getUrlsOfTracks(),
        finishedLoading,
        drawTrack
    );
    bufferLoader.load();
}

function drawTrack(decodedBuffer, trackNumber) {

    console.log("drawTrack : let's draw sample waveform for track No" + trackNumber + " named " +
        currentSong.tracks[trackNumber].name);

    var trackName = currentSong.tracks[trackNumber].name;
    //trackName = trackName.slice(trackName.lastIndexOf("/")+1, trackName.length-4);

    waveformDrawer.init(decodedBuffer, View.masterCanvas, '#83E83E');
    var x = 0;
    var y = trackNumber * SAMPLE_HEIGHT;
    // First parameter = Y position (top left corner)
    // second = height of the sample drawing
    waveformDrawer.drawWave(y, SAMPLE_HEIGHT);

    View.masterCanvasContext.strokeStyle = "white";
    View.masterCanvasContext.strokeRect(x, y, window.View.masterCanvas.width, SAMPLE_HEIGHT);

    View.masterCanvasContext.font = '14pt Arial';
    View.masterCanvasContext.fillStyle = 'white';
    View.masterCanvasContext.fillText(trackName, x + 10, y + 20);
}

function finishedLoading(bufferList) {
    log("Finished loading all tracks, press Start button above!");

    // set the decoded buffer in the song object
    currentSong.setDecodedAudioBuffers(bufferList);

    buttonPlay.disabled = false;
    buttonRecordMix.disabled = false;

    //enabling the loop buttons
    $('#loopBox > button').each(function (key, item) {
        item.disabled = false;
    });

    // enable all mute/solo buttons
    $(".mute").attr("disabled", false);
    $(".solo").attr("disabled", false);

    // enable song select menu
    var s = document.querySelector("#songSelect");
    s.disabled = false;

    // Set each track volume slider to max
    for (i = 0; i < currentSong.getNbTracks(); i++) {
        // set volume gain of track i to max (1)
        //currentSong.setVolumeOfTrack(1, i);
        $(".volumeSlider").each(function (obj, value) {
            obj.value = 100;
        });
    }
}


// ######### SONGS
function loadSongList() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "track", true);

    // Menu for song selection
    var s = $("<select id='songSelect'/>");
    s.appendTo("#songs");

    s.change(function (e) {
        var songName = $(this).val();
        console.log("You chose : " + songName);

        if (songName !== "nochoice") {
            // We load if there is no current song or if the current song is
            // different than the one chosen
            if ((currentSong === undefined) || ((currentSong !== undefined) && (songName !== currentSong.name))) {
                loadSong(songName);
                View.activeConsoleTab();
            }
        }
    });

    xhr.onload = function (e) {
        var songList = JSON.parse(this.response);

        if (songList[0]) {
            $("<option />", {
                value: "nochoice",
                text: "Choose a song..."
            }).appendTo(s);
        }

        songList.forEach(function (songName) {
            console.log(songName);

            $("<option />", {
                value: songName,
                text: songName
            }).appendTo(s);
        });
    };
    xhr.send();
}


// ##### TRACKS #####

function loadSong(songName) {
    resetAllBeforeLoadingANewSong();

    // This function builds the current
    // song and resets all states to default (zero muted and zero solo lists, all
    // volumes set to 1, start at 0 second, etc.)
    currentSong = new Song(songName, context);


    var xhr = new XMLHttpRequest();
    xhr.open('GET', currentSong.url, true);

    xhr.onload = function (e) {
        // get a JSON description of the song
        var song = JSON.parse(this.response);

        // resize canvas depending on number of samples
        resizeSampleCanvas(song.instruments.length);

        // for eah instrument/track in the song
        song.instruments.forEach(function (instrument, trackNumber) {
            // Let's add a new track to the current song for this instrument
            currentSong.addTrack(instrument);

            // Render HTMl
            var span = document.createElement('tr');
            span.innerHTML = 
                '<td class="trackBox" style="height : ' + SAMPLE_HEIGHT + 'px">' +
                "<progress class='pisteProgress' id='progress" + trackNumber + "' value='0' max='100' style='width : " + SAMPLE_HEIGHT + "px' ></progress>" +
                instrument.name + '<div style="float : right;">' +
                "<button class='mute' id='mute" + trackNumber + "' onclick='muteUnmuteTrack(" + trackNumber + ");'><span class='glyphicon glyphicon-volume-up'></span></button> " +
                "<button class='solo' id='solo" + trackNumber + "' onclick='soloNosoloTrack(" + trackNumber + ");'><img src='../img/earphones.png' /></button></div>" +
                "<span id='volspan'><input type='range' class = 'volumeSlider custom' id='volume" + trackNumber + "' min='0' max = '100' value='100' oninput='setVolumeOfTrackDependingOnSliderValue(" + trackNumber + ");'/></span><td>";

            divTrack.appendChild(span);

        });

        // Add range listeners, from range-input.js
        addRangeListeners();


        // disable all mute/solo buttons
        $(".mute").attr("disabled", true);
        $(".solo").attr("disabled", true);

        // Loads all samples for the currentSong
        loadAllSoundSamples();
    };
    xhr.send();
}