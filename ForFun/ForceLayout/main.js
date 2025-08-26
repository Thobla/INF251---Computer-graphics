import { basicGraph } from "./modules/graphStructure.js";
import { step } from "./modules/simulation.js";
let gl = undefined;
let canvas = undefined;

let program = undefined;
let vsSource = undefined;
let fsSource = undefined;

// TODO: Make this into init function
//let n = 6;
//let m = 7;
////let positionMap = {0: [-0.5, 0.3], 1: [0, 0.4], 2: [0.5, 0.5], 3: [-0.45, -0.3], 4: [0, 0], 5:[0.4, -0.3]}
//let edgeList = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [3, 5]];
//let positionMap = [...Array(n + 1).keys()].map(() => [Math.random()*2 -1, Math.random()*2 - 1]);

window.onload = function init(){
    canvas = document.getElementById("webgl-canvas");
    if (!canvas){
        console.log("Moron! Canvas is unavailable");
    }

    gl = canvas.getContext("webgl2");
    if (!gl){
        console.log("Your browser does not support webgl2, sucks to suck");
    }

    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.25, 1.0); // Define the background color after we clear the canvas

    setupShaders();

    main();
}

function setupShaders(){
    program = gl.createProgram();

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

function main(){

    const [bufferData, n, m] = graphToBuffer();

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.DYNAMIC_DRAW);

    const aPositionLoc = gl.getAttribLocation(program, "aPosition");
    const aPointSizeLoc = gl.getAttribLocation(program, "aPointSize")
    const aColorLoc = gl.getAttribLocation(program, "aColor");

    gl.enableVertexAttribArray(aPositionLoc);
    gl.enableVertexAttribArray(aPointSizeLoc);
    gl.enableVertexAttribArray(aColorLoc);

    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 6*4, 0);
    gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 6*4, 2*4);
    gl.vertexAttribPointer(aColorLoc, 3, gl.FLOAT, false, 6*4, 3*4);

    render(n, m);
    requestAnimationFrame(main);
}


function render(n, m){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    
    step(basicGraph);
    
    gl.drawArrays(gl.LINES, 0, 2*m);
    gl.drawArrays(gl.POINTS, 2*m, n);
}

function graphToBuffer(){

    let bufferData = new Float32Array((basicGraph.n + 2*basicGraph.m) * 6);
    // Drawing lines
    for (let i = 0; i < 2*basicGraph.m; i+=2){
        bufferData[i*6] = basicGraph.state.get(basicGraph.edgeList[i/2][0]).x;
        bufferData[i*6 + 1] = basicGraph.state.get(basicGraph.edgeList[i/2][0]).y;
        bufferData[i*6 + 2] = 4;
        bufferData[i*6 + 3] = 1;
        bufferData[i*6 + 4] = 0;
        bufferData[i*6 + 5] = 0;
        bufferData[(i + 1)*6] = basicGraph.state.get(basicGraph.edgeList[i/2][1]).x;
        bufferData[(i + 1)*6 + 1] = basicGraph.state.get(basicGraph.edgeList[i/2][1]).y;
        bufferData[(i+1)*6 + 2] = 4;
        bufferData[(i+1)*6 + 3] = 0;
        bufferData[(i+1)*6 + 4] = 1;
        bufferData[(i+1)*6 + 5] = 0;
    }
    for (let i = 0; i < basicGraph.n; i++){
        bufferData[basicGraph.m*12 + i*6] = basicGraph.state.get(i).x;
        bufferData[basicGraph.m*12 + i*6 + 1] = basicGraph.state.get(i).y;
        bufferData[basicGraph.m*12 + i*6 + 2] = 4;
        bufferData[basicGraph.m*12 + i*6 + 3] = 1;
        bufferData[basicGraph.m*12 + i*6 + 4] = 1;
        bufferData[basicGraph.m*12 + i*6 + 5] = 1;
    }
    return [bufferData, basicGraph.n, basicGraph.m];
}
