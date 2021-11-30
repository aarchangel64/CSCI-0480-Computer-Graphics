// Library to simplify WebGL boilerplate: https://twgljs.org
import * as twgl from "../../../libs/twgl/twgl-full.module.js";

import {
	cubeArrays,
	sphereArrays
} from "./mesh.js";

export {
	initGL,
	drawCube,
	drawSphere
};

let drawCube, drawSphere;

async function initGL(gl) {

	const vertFile = "vertex.glsl";
	const fragFile = "fragment.glsl";

	// Set the shader source code.
	// Retrieve shader files from server, see: https://community.khronos.org/t/how-to-include-shaders/2591/2
	const uri = document.baseURI + "js/";
	let response = await fetch(uri + vertFile);
	const vertSource = await response.text();
	response = await fetch(uri + fragFile);
	const fragSource = await response.text();

	// setup GLSL program
	twgl.setAttributePrefix("a"); // Tell the webglUtils to match position with a_position
	const programInfo = twgl.createProgramInfo(gl, [vertSource, fragSource]);

	// Create Vertex Array Objects from generated meshes in mesh.js
	const sphereBufferInfo = twgl.createBufferInfoFromArrays(gl, sphereArrays);
	const sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);

	const cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeArrays);
	const cubeVAO = twgl.createVAOFromBufferInfo(gl, programInfo, cubeBufferInfo);

	function drawMesh(vao, bufferInfo, unis) {
		gl.useProgram(programInfo.program);
		gl.bindVertexArray(vao);
		twgl.setUniforms(programInfo, unis);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, bufferInfo.numElements)
	}

	drawSphere = (u) => drawMesh(sphereVAO, sphereBufferInfo, u);
	drawCube = (u) => drawMesh(cubeVAO, cubeBufferInfo, u);
}