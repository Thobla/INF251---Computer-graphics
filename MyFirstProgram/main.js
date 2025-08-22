const canvas = document.getElementById('webgl');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('Make sure your browser supports webgl');
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);

const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

const fsSource = `
void main(){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

// Function to compile a shader
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Compile shaders
const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

// Create a shader program
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
}

// Use the shader program
gl.useProgram(shaderProgram);

// Define vertices for a simple triangle
const positions = [
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
];

// Create a buffer for the positions
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Get the attribute location for vertex position
const vertexPositionLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');

// Tell WebGL how to pull out the positions from the position buffer
gl.vertexAttribPointer(
    vertexPositionLocation,
    2, // 2 components per vertex (x, y)
    gl.FLOAT, // the data is 32bit floating point
    false, // don't normalize the data
    0, // 0 stride, use default
    0 // start at the beginning of the buffer
);
gl.enableVertexAttribArray(vertexPositionLocation);

// Draw the triangle
gl.drawArrays(gl.TRIANGLES, 0, 3);
