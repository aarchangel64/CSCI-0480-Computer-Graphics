#version 300 es
precision highp float;

// attributes (webGL 2: 'in') recieves data from a buffer
in vec4 aPos;
in vec4 aNorm;

uniform mat4 uMatrix;

// varyings (webGL 2: 'out') pass data to the fragment shader
out vec4 vColour;

// uniforms contain shared vertex data from the CPU
uniform float uTime;
uniform vec2 uAngle;

void main() {
  gl_Position = uMatrix * aPos;
  vColour = aNorm;
}
