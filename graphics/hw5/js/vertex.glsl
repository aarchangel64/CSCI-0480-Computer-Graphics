#version 300 es
precision highp float;

// attributes (webGL 2: 'in') recieves data from a buffer
in vec3 aPos;
in vec3 aNorm;
in vec2 aUV;

uniform mat4 uMatrix;

// varyings (webGL 2: 'out') pass data to the fragment shader
out vec3 vPos;
out vec3 vNorm;
out vec2 vUV;

void main() {
  gl_Position = uMatrix * vec4(aPos, 1.0);
  vPos = aPos;
  vNorm = aNorm;
  vUV = aUV;
}
