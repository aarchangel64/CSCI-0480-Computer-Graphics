#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 vColour;
in vec2 vUV;

uniform vec4 uColorMult;

out vec4 outColor;

void main() {
	outColor = vColour;
	// outColor = vec4(vUV.x, vUV.y, 0.0, 1.0);
	// outColor = vec4(1.0, 0.0, 0.0, 1.0);
}
