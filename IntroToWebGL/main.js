'use strict;'

/** @type {HTMLCanvasElement} */    // for VSCode to know that canvas is an HTML Canvas Element
let canvas = undefined;
let gl = undefined;

let program = undefined;
let vsSource = undefined;
let fsSource = undefined;

let start = 0;
let end = 100;
let points = 1000;
let scale = 100;
let pixelSize = 1;



window.onload = function init() {
    canvas = document.getElementById('webgl-canvas');
    if (!canvas){
        alert('Cannot find webgl-canvas')
    }

    gl = canvas.getContext('webgl2');
    if (!gl){
        alert('To bad, you dont have webgl-browser')
    }

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.25, 1.0); // Define the background color after we clear the canvas

    main();

    // Attribute -> VS -> FS
    let sinusCurve = x => (x, Math.sin(x));

    let bufferData = new Float32Array([...Array(points + 1).keys()].map((x) =>{
        return [x/points, scale*sinusCurve(x/scale)/points, pixelSize, 1, 1, 1]
    }).flat());
    console.log(bufferData); 
//    const bufferData = new Float32Array([ //This is an array of our data
//        -0.5,0,     100,    1,0,0, //red
//        0,0.866,    48,     0,0,1, //blue
//        0.3,0,      32,     0,1,0, //green
//
//        0.5,0.5,    32,     1,1,0, //yellow
//        0.65,-1.0,  100,    1,0,1, //magenta
//        0.9,0.866,  48,     0,1,1, //cyan
//    ])

    const buffer = gl.createBuffer(); // Define a new buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Define the buffer to be an ARRAY_BUFFER????
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW); // Add the data from our array to the newly defined buffer (We will likely not change this data, so static for optimization)

    // Attributes defining how to draw data from the buffers
    const aPositionLoc = gl.getAttribLocation(program, "aPosition"); // Add a pointer to the VS's aPosition (attribute)
    const aPointSizeLoc = gl.getAttribLocation(program, "aPointSize"); // Add pointer to the VS's aPointSize
    const aColorLoc = gl.getAttribLocation(program, "aColor"); // Add pointer to the VS's aColor

    // We enable attributes
    gl.enableVertexAttribArray(aPositionLoc);
    gl.enableVertexAttribArray(aPointSizeLoc);
    gl.enableVertexAttribArray(aColorLoc);

    // define how attribute shall draw the data
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 6*4, 0); // Add 2 first float values, starting at index 0
    gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 6*4, 2*4); // Add first float values, starting at index 2
    gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 6*4, 3*4);// Add 3 first float values, starting at index 3
    // Each index-jump is of length 6*4, since float is 4 bytes, and we have 6 floats for each datapoint



    render(); // Draw the triangles!!!!
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT); // First we clear the canvas
    gl.useProgram(program); // Attach gl to program
    //gl.drawArrays(gl.TRIANGLES, 0, 6); // draw triangles, consisting of 6 vertices
    gl.drawArrays(gl.LINE_STRIP, 0, 1000); // draw triangles, consisting of 6 vertices
}

function main(){
    program = gl.createProgram(); // Initialize the program

    vsSource = document.getElementById("vs").textContent.replace(/^\s+|\s+$/g, '' );// DEfine our vertex shader source code

    const vertexShader = gl.createShader(gl.VERTEX_SHADER); // define a new shader
    gl.shaderSource(vertexShader, vsSource);  // Add the source code to the newly defined vertexShader
    gl.compileShader(vertexShader); // Compile the vertex shader from vsSource
    gl.attachShader(program, vertexShader); // Add the newly compiled shader to the program

    // Do the same for the fragment shader
    fsSource = document.getElementById("fs").textContent.replace(/^\s+|\s+$/g, '' );

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    // Link and check that it is working
    gl.linkProgram(program); // Link the two shaders together, VS -> FS -> OUTPUT
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.log(gl.getShaderInfoLog(vertexShader));
        console.log(gl.getShaderInfoLog(fragmentShader));
    }
}
