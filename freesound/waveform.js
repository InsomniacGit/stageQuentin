// export default function createWaveform() {

//     // create a canvas and append to the sampler
//     const canvas = document.getElementById('canvas');

//     // get the canvas context
//     const ctx = canvas.getContext('2d');

//     // set the canvas width and height
//     canvas.width = 600;
//     canvas.height = 100;

//     // set the canvas background color to black
//     ctx.fillStyle = 'rgb(0, 0, 0)';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // set the canvas line color orange
//     ctx.strokeStyle = 'rgb(255,165,0)';
//     ctx.lineWidth = 2;

//     // draw the waveform
//     ctx.beginPath();
//     ctx.moveTo(0, 50);
//     ctx.lineTo(100, 50);
//     ctx.lineTo(200, 75);
//     ctx.lineTo(300, 25);
//     ctx.lineTo(400, 75);
//     ctx.lineTo(500, 25);
//     ctx.lineTo(600, 50);
//     ctx.stroke();
// }