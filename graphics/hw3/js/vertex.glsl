#version 300 es

// Vertex shader program
precision mediump float;

// webgl2: in (attributes) recieves data from a buffer
layout(location = 0) in vec3 aPos;

// webgl2: out (varying) pass data to the fragment shader
out vec3 vPos;

// uniforms contain shared vertex data from the CPU
uniform float uTime;
uniform vec2 uAngle;

void main() {
      vPos = aPos;
      gl_Position = vec4(aPos, 1.);
}
