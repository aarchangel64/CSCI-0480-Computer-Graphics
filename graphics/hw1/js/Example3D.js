// NOTE: gl.js contains the bulk of WebGL code, and the shaders are in their own GLSL files.
import { setupCanvas } from "./canvas.js";
import { setupGL, initBuffers, drawScene } from "./gl.js";

const clamp = (x, min, max) => Math.min(Math.max(x, min), max);

// Make canvas pixel resolution match CSS resolution
const canvas = setupCanvas("glCanvas");
const gl = canvas.getContext("webgl");

// Only continue if WebGL is available and working
if (gl === null) {
  alert(
    "Unable to initialize WebGL. Your browser or machine may not support it."
  );
}

// Initialise Shaders and Buffers
const programData = await setupGL(gl, canvas);
const buffers = initBuffers(gl);

// Get the location of the mouse over the Canvas in the interval [-1.0, 1.0]
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  const cWidth = canvas.width / (2 * devicePixelRatio);
  const cHeight = canvas.height / (2 * devicePixelRatio);
  mouseX = clamp((e.clientX - (canvas.offsetLeft + cWidth)) / cWidth, -1, 1);
  mouseY = clamp((e.clientY - (canvas.offsetTop + cHeight)) / cHeight, -1, 1);
});


// Function that runs on every frame
function render(now) {
  now *= 0.001; // Convert milliseconds to seconds
  drawScene(gl, programData, buffers, now, mouseX, mouseY);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
