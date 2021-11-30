// Heavy guidance from https://webgl2fundamentals.org

// glMatrix Library for fast vector / matrix maths
import "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/3.4.2/gl-matrix-min.js";
// Library to simplify WebGL boilerplate: https://twgljs.org
import * as twgl from "../../../libs/twgl/twgl-full.module.js";
import { initGL, drawCube, drawSphere } from "./draw.js";
const mat4 = glMatrix.mat4;
const vec4 = glMatrix.vec4;

const canvas = document.getElementById("hw5");
const gl = canvas.getContext("webgl2");

// Only continue if WebGL is available and working
if (gl === null) {
  alert(
    "Unable to initialize WebGL 2.0. Your browser or machine may not support it."
  );
}


await initGL(gl);

const uniforms = {
  uMatrix: mat4.fromRotation([], 2, [1, 1, 0]),
  uColourMult: [1.0, 0.5, 1.0, 1.0],
};

  // Compute the projection matrix
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const fov = (60 * Math.PI) / 180;
  const projectionMatrix = mat4.perspective([], fov, aspect, 1, 1000);

// Function that runs on every frame
function render(now) {
  now *= 0.001; // Convert milliseconds to seconds

  twgl.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  // Compute the camera's matrix using look at.
  const cameraPosition = [5 * Math.sin(now), 5, 5 * Math.cos(now)];
  const target = [0, 0, 0];
  const up = [0, 1, 0];
  const viewMatrix = mat4.lookAt([], cameraPosition, target, up);

  const viewProjectionMatrix = mat4.multiply([], projectionMatrix, viewMatrix);

  mat4.translate(uniforms.uMatrix, viewProjectionMatrix, [-1,0,0]);


  drawSphere(uniforms);
  mat4.translate(uniforms.uMatrix, viewProjectionMatrix, [2,0,0]);
  drawCube(uniforms);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
