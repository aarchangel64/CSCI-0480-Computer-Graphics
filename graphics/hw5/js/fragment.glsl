#version 300 es
precision highp float;

// Passed in from the vertex shader.
in vec3 vPos;
in vec3 vNorm;
in vec2 vUV;

uniform vec3 uAmbient;
uniform vec3 uDiffuse;
uniform vec3 uSpecular;
uniform float uSpecPow;

out vec4 outColour;

const float fl = 3.0;
const int nL = 2;
const vec3 uLightsDir[] = vec3[] (vec3(.57), vec3(0., -0.5, -1.));
const vec3 uLightCol[] = vec3[] (vec3(1.), vec3(.5, .4, 0.05));

// GOURAUD SHADING WITH CAST SHADOWS.
vec3 shadeSurface(vec3 P, vec3 W, vec3 N) {
	vec3 c = uAmbient;

	for(int l = 0; l < nL; l++) {
		vec3 R = 2. * max(0., dot(N, uLightsDir[l])) * N - uLightsDir[l];
		c += uLightCol[l] * uDiffuse * max(0., dot(N, uLightsDir[l]));
		c += uLightCol[l] * uSpecular * pow(max(0., dot(R, -W)), uSpecPow);
	}

	return c;
}

void main() {

	vec3 W = normalize(vec3(vPos.xy, -fl));
	outColour = vec4(shadeSurface(vPos, W, vNorm), 1.0);
}
