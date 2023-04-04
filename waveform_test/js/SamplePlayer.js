import WaveformDrawer from './WaveformDrawer.js';

export default class SamplePlayer {
    constructor(audioCtx, canvasWaveform, canvasOverlay, color) {
        this.ctx = audioCtx;
        this.canvasWaveform = canvasWaveform;
        this.decodedSound = null;
        this.color = color;

        // we add an overlay canvas on top of the waveform canvas
        this.canvasOverlay = canvasOverlay;
        this.ctxCanvasOverlay = this.canvasOverlay.getContext("2d");

        this.leftTrimBar = {
            x: 0,
            color: "white"
        }
        this.rightTrimBar = {
            x: this.canvasOverlay.width,
            color: "white"
        }
    }

    async loadSound(url) {
        const response = await fetch(url);
        const sound = await response.arrayBuffer();

        console.log("Sound loaded");

        // Let's decode it. This is also asynchronous
        this.ctx.decodeAudioData(sound, (buffer) => {
            console.log("Sound decoded");
            this.decodedSound = buffer;

            this.waveformDrawer = new WaveformDrawer();
            this.waveformDrawer.init(this.decodedSound, this.canvasWaveform, this.color);

        }, (e) => {
            console.log("error");
        });
    }

    play() {
        this.startTime = this.ctx.currentTime;

        this.bufferSource = this.ctx.createBufferSource();
        this.bufferSource.buffer = this.decodedSound;
        this.bufferSource.connect(this.ctx.destination);

        let bufferDuration = this.bufferSource.buffer.duration;
        // pixelsToSeconds
        this.leftTrimBar.startTime = this.pixelToSeconds(this.leftTrimBar.x, bufferDuration);
        let trimmedDuration = this.pixelToSeconds(this.rightTrimBar.x - this.leftTrimBar.x, bufferDuration);
        this.bufferSource.start(0, this.leftTrimBar.startTime, trimmedDuration);

        this.startTime = this.ctx.currentTime;

    }

    pixelToSeconds(x, bufferDuration) {
        // canvas.width -> bufferDuration
        // x -> result
        return x * bufferDuration / this.canvasOverlay.width;
    }

    secondsToPixel(time, bufferDuration) {
        // bufferDuration -> canvas.width
        // time -> result
        return time * this.canvasOverlay.width / bufferDuration;
    }

    drawWaveform() {
        const ctxWaveform = this.canvasWaveform.getContext("2d");

        // draw waveform
        ctxWaveform.clearRect(0, 0, this.canvasWaveform.width, this.canvasWaveform.height);
        this.waveformDrawer.drawWave(0, this.canvasWaveform.height);
    }

    drawOverlays() {
        // clear overlay canvas;
        this.ctxCanvasOverlay.clearRect(0, 0, this.canvasOverlay.width, this.canvasOverlay.height);

        // draw trim bars and triangles
        this.drawTrimArrows();

        // draw timebar
        this.drawTimeBar();
    }

    drawTimeBar() {
        if (!this.bufferSource) return;
        let ctx = this.ctxCanvasOverlay;
        ctx.save();
        // Draw vertical bar at currentTime from this.bufferSource
        let elapsedTime = this.ctx.currentTime - this.startTime;
        //console.log(elapsedTime)
        let elapsedTimeInPixels = this.secondsToPixel(elapsedTime, this.bufferSource.buffer.duration);
        //console.log(elapsedTimeInPixels)
        let x = this.leftTrimBar.x + elapsedTimeInPixels;
        if (x <= this.rightTrimBar.x) {

            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvasOverlay.height);
            ctx.stroke();
        }
        ctx.restore();
    }

    drawTrimArrows() {
        let ctx = this.ctxCanvasOverlay;

        ctx.save();

        // two vertical lines
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.leftTrimBar.color;
        ctx.beginPath();
        // start
        ctx.moveTo(this.leftTrimBar.x, 0);
        ctx.lineTo(this.leftTrimBar.x, this.canvasOverlay.height);
        ctx.stroke();

        // end
        ctx.beginPath();
        ctx.strokeStyle = this.rightTrimBar.color;
        ctx.moveTo(this.rightTrimBar.x, 0);
        ctx.lineTo(this.rightTrimBar.x, this.canvasOverlay.height);
        ctx.stroke();

        // triangle start
        ctx.fillStyle = this.leftTrimBar.color;
        ctx.beginPath();
        ctx.moveTo(this.leftTrimBar.x, -0);
        ctx.lineTo(this.leftTrimBar.x + 10, 8);
        ctx.lineTo(this.leftTrimBar.x, 16);
        ctx.fill();

        // tiangle end
        ctx.beginPath();
        ctx.fillStyle = this.rightTrimBar.color;
        ctx.moveTo(this.rightTrimBar.x, -0);
        ctx.lineTo(this.rightTrimBar.x - 10, 8);
        ctx.lineTo(this.rightTrimBar.x, 16);
        ctx.fill();

        // We draw grey transparent rectangles before leftTrimBar and after rightTrimBar
        ctx.fillStyle = "rgba(128, 128, 128, 0.7)"
        ctx.fillRect(0, 0, this.leftTrimBar.x, this.canvasOverlay.height);
        ctx.fillRect(this.rightTrimBar.x, 0, this.canvasOverlay.width, this.canvasOverlay.height);

        ctx.restore();
    }

    highLightTrimBarsWhenClose(mousePos) {
        // compute distance between mousePos and trim pos
        let d = this.distance(mousePos.x, mousePos.y, this.leftTrimBar.x + 5, 4);
        if ((d < 10) && (!this.rightTrimBar.selected)) {
            this.leftTrimBar.color = "red";
            this.leftTrimBar.selected = true;
        } else {
            this.leftTrimBar.color = "white";
            this.leftTrimBar.selected = false;
        }

        d = this.distance(mousePos.x, mousePos.y, this.rightTrimBar.x - 5, 4);
        if ((d < 10) && (!this.leftTrimBar.selected)) {
            this.rightTrimBar.color = "red";
            this.rightTrimBar.selected = true;
        } else {
            this.rightTrimBar.color = "white";
            this.rightTrimBar.selected = false;
        }

        this.updateTrimBars(mousePos);
    }

    distance(x1, y1, x2, y2) {
        let y = x2 - x1;
        let x = y2 - y1;

        return Math.sqrt(x * x + y * y);
    }

    // on mouse move
    updateTrimBars(mousePos) {
        if (mousePos.x <= 0) {
            this.leftTrimBar.x = 0;
            //leftTrimBar.dragged = false;
            //leftTrimBar.selected = false;
            //leftTrimBar.color = "white";
        }
        if (mousePos.x >= this.canvasOverlay.width) {
            this.rightTrimBar.x = this.canvasOverlay.width;
            //leftTrimBar.dragged = false;
            //leftTrimBar.selected = false;
            //leftTrimBar.color = "white";
        }

        if (this.leftTrimBar.dragged) {
            if (this.leftTrimBar.x < this.rightTrimBar.x)
                this.leftTrimBar.x = mousePos.x;
            else {
                if (mousePos.x < this.rightTrimBar.x)
                    this.leftTrimBar.x = mousePos.x;
            }

        }
        if (this.rightTrimBar.dragged) {
            if (this.rightTrimBar.x > this.leftTrimBar.x)
                this.rightTrimBar.x = mousePos.x;
            else {
                if (mousePos.x > this.rightTrimBar.x)
                    this.rightTrimBar.x = mousePos.x;
            }
        }
    }

    // on mouse click
    selectTrimbars() {
        if (this.leftTrimBar.selected)
            this.leftTrimBar.dragged = true;

        if (this.rightTrimBar.selected)
            this.rightTrimBar.dragged = true;
    }

    // on mouse up
    releaseTrimBars() {
        if (this.leftTrimBar.dragged) {
            this.leftTrimBar.dragged = false;
            this.leftTrimBar.selected = false;
            if (this.leftTrimBar.x > this.rightTrimBar.x)
                this.leftTrimBar.x = this.rightTrimBar.x;
        }

        if (this.rightTrimBar.dragged) {
            this.rightTrimBar.dragged = false;
            this.rightTrimBar.selected = false;

            if (this.rightTrimBar.x < this.leftTrimBar.x)
                this.rightTrimBar.x = this.leftTrimBar.x;
        }
    }
}