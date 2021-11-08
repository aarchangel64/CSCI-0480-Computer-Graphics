// glMatrix Library for fast vector / matrix maths
import "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/3.4.2/gl-matrix-min.js";
import { setupCanvas } from "./canvas.js";
import { initGL, drawScene } from "./gl.js";

const clamp = (x, min, max) => Math.min(Math.max(x, min), max);

// Make canvas pixel resolution match CSS resolution
const canvas = setupCanvas("hw2");
const gl = canvas.getContext("webgl2");

// Only continue if WebGL is available and working
if (gl === null) {
  alert(
    "Unable to initialize WebGL 2.0. Your browser or machine may not support it."
  );
}

// Initialise Shaders
await initGL(gl, canvas);

// const matList =

// class Material {
//   constructor(diffuse, ambient, specular) {
//     this.diffuse = diffuse;
//     this.ambient = ambient;
//     this.specular = specular;
//   }
// }

// const copper = new Material(
//   [0.15, 0.05, 0.025],
//   [0.3, 0.1, 0.05],
//   [0.6, 0.2, 0.1, 3]
// );

// const gold = new Material(
//   [0.25, 0.15, 0.025],
//   [0.5, 0.3, 0.05],
//   [1, 0.6, 0.1, 6]
// );

// const lead = new Material([0.05, 0.05, 0.05], [0.1, 0.1, 0.1], [1, 1, 1, 5]);
// const plastic = new Material([0.025, 0.0, 0.0], [0.5, 0.0, 0.0], [2, 2, 2, 20]);

const copper = [
  0.15, 0.05, 0.025, 0, 0.3, 0.1, 0.05, 0, 0.6, 0.2, 0.1, 5, 0, 0, 0, 0.05,
];
const gold = [
  0.25, 0.15, 0.025, 0, 0.5, 0.3, 0.05, 0, 1, 0.6, 0.1, 3, 0, 0, 0, 0.4,
];
const lead = [
  0.05, 0.05, 0.05, 0, 0.1, 0.1, 0.1, 0, 0.8, 0.8, 0.8, 10, 0, 0, 0, 0.1,
];
const plastic = [
  0.025, 0.0, 0.0, 0, 0.5, 0.0, 0.0, 0, 2, 2, 2, 20, 0, 0, 0, 0.005,
];

const mirror = [
  0.2, 0.2, 0.2, 0, 1.0, 1.0, 1.0, 0, 2, 2, 2, 20, 0, 0, 0, 0.6,
];

const mats = [copper, gold, plastic, lead, gold, mirror];


// Function that runs on every frame
function render(now) {
  now *= 0.001; // Convert milliseconds to seconds

  // USE SLIDERS TO SET COLOR OF KEY LIGHT.
  let r = red.value / 100;
  let g = green.value / 100;
  let b = blue.value / 100;
  const lightCol = [r, g, b, 0.3, 0.2, 0.1];

  // ANIMATE SPHERE POSITIONS BEFORE RENDERING.
  let sc = [];
  const c = Math.cos(now);
  const s = Math.sin(now);

  sc[0] = [-0.35 + 0.1 * c, 0.35, -0.2, 0.3];
  sc[1] = [0.25, 0.25 + 0.1 * s, 0.2, 0.3];
  sc[2] = [-0.35 - 0.2 * s, 0.05 - 0.2 * c, -0.5, 0.3];
  sc[3] = [0.35 - 0.2 * s, 0.05 + 0.2 * c, -0.5, 0.3];
  sc[4] = [0.4 * c, -0.6, -0.4 * s, 0.3];

  // SPHERE RADIUS IS VARIED VIA SLIDER.
  sc.forEach((s) => {
    s[3] = 0.2 + (0.2 * radius.value) / 100;
  });

  let cube = [
    -1, 0, 0, -1, 1, 0, 0, -1, 0, -1, 0, -1, 0, 1, 0, -1, 0, 0, -1, -1, 0, 0, 1,
    -1,
  ];

  // cube
  let cM = [];
  const rot = glMatrix.quat.fromEuler([], 20, now * 30, Math.sin(now) * 10);
  glMatrix.mat4.fromRotationTranslationScale(cM, rot, [0, -0.4, 0], [0.7, 0.05, 0.6]);
  glMatrix.mat4.invert(cM, cM);

  drawScene(gl, now, lightCol, sc, cube, cM, mats);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
