// Heavy guidance from https://webgl2fundamentals.org

// glMatrix Library for fast vector / matrix maths
import "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/3.4.2/gl-matrix-min.js";
// Library to simplify WebGL boilerplate: https://twgljs.org
import * as twgl from "../../../libs/twgl/twgl-full.module.js";
import {
	initGL,
	drawCube,
	drawSphere
} from "./draw.js";
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
	uLightsDir: [.57, .57, .57, 0., -0.5, -1.],
	uLightCol: [1, 1, 1, .5, .2, 0.05],
	uAmbient: [0.25, 0.15, 0.025],
	uDiffuse: [0.5, 0.3, 0.05],
	uSpecular: [1, 0.6, 0.1],
	uSpecPow: 3.0,
};

// Compute the projection matrix
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const fov = (60 * Math.PI) / 180;
const projectionMatrix = mat4.perspective([], fov, aspect, 1, 1000);

// Get the location of the mouse over the Canvas in the interval [-1.0, 1.0]
let mouseX = 0;
let mouseY = 0;

const clamp = (x, min, max) => Math.min(Math.max(x, min), max);
document.addEventListener("mousemove", (e) => {
	const cWidth = gl.canvas.width / (2 * devicePixelRatio);
	const cHeight = gl.canvas.height / (2 * devicePixelRatio);
	mouseX = clamp((e.clientX - (gl.canvas.offsetLeft + cWidth)) / cWidth, -1, 1);
	mouseY = clamp((e.clientY - (gl.canvas.offsetTop + cHeight)) / cHeight, -1, 1);
});

// Function that runs on every frame
function render(now) {
	now *= 0.001; // Convert milliseconds to seconds

	twgl.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Move the X and Z direction of Light 1
	uniforms.uLightsDir[0] = 0.7 * Math.cos(now / 5);
	uniforms.uLightsDir[2] = 0.7 * Math.sin(now / 5);
	uniforms.uLightCol[1] = 0.7 + 0.3 * Math.cos(now / 2);
	uniforms.uLightCol[0] = 0.8 + 0.2 * Math.sin(now / 5);

	// Compute the camera's matrix using look at.
	const cameraPosition = [5 * Math.sin(-Math.PI * mouseX), 5 * mouseY, 5 * Math.cos(-Math.PI * mouseX)];
	const target = [0, 0, 0];
	const up = [0, 1, 0];
	const viewMatrix = mat4.lookAt([], cameraPosition, target, up);

	const viewProjectionMatrix = mat4.multiply([], projectionMatrix, viewMatrix);

	const n = 10
	for (let i = 0; i < n; i++) {
		uniforms.uAmbient[2] = i / n;
		mat4.scale(viewProjectionMatrix, viewProjectionMatrix, [0.9, 0.9, 0.9]);
		const a = (2 * Math.PI * i + now * i) / n; 
		mat4.translate(uniforms.uMatrix, viewProjectionMatrix, [4*Math.cos(a), 0, 4*Math.sin(a)]);
		drawSphere(uniforms);
		mat4.translate(uniforms.uMatrix, viewProjectionMatrix, [4, 2*i, 2*i]);
		drawCube(uniforms);
	}

	requestAnimationFrame(render);
}

requestAnimationFrame(render);