#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec4 vColour;

uniform vec4 uColorMult;

out vec4 outColor;

void main() { outColor = vec4(1.0, 0.0, 0.0, 1.0); } // vColour * uColorMult; }
