// Vertex shader program
precision mediump float;

// attributes recieves data from a buffer
attribute vec3 aPos;

// varyings pass data to the fragment shader
varying vec3 vPos;

// uniforms contain shared vertex data from the CPU
uniform float uTime;
uniform vec2 uAngle;

void main() {
      vPos = aPos;
      gl_Position = vec4(aPos, 1.);
}
