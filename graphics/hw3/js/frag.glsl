#version 300 es
precision highp float;

// MODIFY STRING TO ADD NUMBER OF SPHERES.
const int numSpheres = 5;
const int nL = 2;

// LIGHTS AND SPHERES DATA COMES FROM CPU.
uniform vec3 uLightsDir[nL];
uniform vec3 uLightCol[nL];

uniform vec4 uSpheres[numSpheres];
uniform int uMats[numSpheres + 1];

uniform sampler2D uTex;

uniform mat4 uCIM;
uniform vec4 uCube[6];

uniform mat4 uQ[2];

uniform float uTime;
in vec3 vPos;

const float fl = 3.0;                  // Focal Length
const float n1 = 1.0;                  // AIR INDEX OF REFRACTION
const float n2 = 1.5;                  // GLASS INDEX OF REFRACTION
const int maxBounces = 3;              // Number of reflection bounces
const vec3 bgColor = vec3(.3, .4, .5); // Sky background colour

vec2 solveQuadratic(float a, float b, float c) {
  float d = b * b - 4. * a * c;
  if (d < 0.)
    return vec2(1000., -1000.);
  float t0 = (-b - sqrt(d)) / (2. * a);
  float t1 = (-b + sqrt(d)) / (2. * a);
  return vec2(min(t0, t1), max(t0, t1));
}

// INTERSECT A RAY WITH A HALFSPACE.
float rayHalfspace(vec3 V, vec3 W, vec4 H) {
  vec4 V1 = vec4(V, 1.);
  vec4 W0 = vec4(W, 0.);
  return -dot(V1, H) / dot(W0, H);
}

// INTERSECT A RAY WITH A CUBE.
vec4 rayCube(vec3 V, vec3 W, mat4 IM) {

  float tIn = -1000., tOut = 1000.;

  // ALGORITHM TO INTERSECT A RAY WITH
  // AN INTERSECTION OF HALFSPACES

  vec3 N = vec3(0.);
  for (int i = 0; i < 6; i++) {

    // TRANSFORM FACE TO GET HALFSPACE.

    vec4 H = uCube[i] * IM;

    // SCALE SO THAT H.xyz IS UNIT LENGTH.

    H /= sqrt(dot(H.xyz, H.xyz));

    // ARE WE ENTERING OR LEAVING THE CUBE?

    float t = rayHalfspace(V, W, H);
    if (dot(W, H.xyz) < 0.) {

      // IF THIS IS ENTRY WITH GREATEST t
      // THEN SET THE SURFACE NORMAL.

      if (t > tIn)
        N = H.xyz;
      tIn = max(tIn, t);
    } else
      tOut = min(tOut, t);
  }

  // PACK SURFACE NORMAL AND t INTO A vec4.

  return vec4(N, tIn > tOut ? -1. : tIn);
}

// INTERSECT A RAY WITH A SPHERE.
// IF NO INTERSECTION, RETURN NEGATIVE VALUE.
float raySphere(vec3 V, vec3 W, vec4 S) {
  V = V - S.xyz + .001 * W;
  float b = dot(V, W);
  float d = b * b - dot(V, V) + S.w * S.w;
  return d < 0. ? -1. : -b - sqrt(d);
}

vec3 getMat(int material, int component) {
  return texelFetch(uTex, ivec2(component, material), 0).rgb;
}

// GOURAUD SHADING WITH CAST SHADOWS.
vec3 shadeSurface(vec3 P, vec3 W, vec3 N, int m) {
  vec3 Ambient = getMat(m, 0);
  vec3 Diffuse = getMat(m, 1);
  vec3 Specular = getMat(m, 2);
  float SpecPow = getMat(m, 3).x;

  vec3 c = Ambient;
  for (int l = 0; l < nL; l++) {

    // ARE WE SHADOWED BY ANY OTHER SPHERE?
    float t = -1.;
    for (int n = 0; n < numSpheres; n++)
      t = max(t, raySphere(P, uLightsDir[l], uSpheres[n]));

    // Are we shadowed by a cube?
    t = max(t, rayCube(P, uLightsDir[l], uCIM).w);

    // IF NOT, ADD LIGHTING FROM THIS LIGHT
    if (t < 0.) {
      vec3 R = 2. * dot(N, uLightsDir[l]) * N - uLightsDir[l];
      c += uLightCol[l] * Diffuse * max(0., dot(N, uLightsDir[l]));
      c += uLightCol[l] * Specular * pow(max(0., dot(R, -W)), SpecPow);
    }
  }

  return c;
}

vec3 trace(vec3 V, vec3 W) {
  vec3 color = vec3(0);
  float prop = 1.0;

  for (int bounce = 0; bounce <= maxBounces; bounce++) {

    float tMin = 10000.;
    vec3 P, N;
    vec4 sphere;
    int mat;
    bool hit = false;

    for (int n = 0; n < numSpheres; n++) {
      float t = raySphere(V, W, uSpheres[n]);
      if (t > 0. && t < tMin) {
        hit = true;
        P = V + t * W;
        sphere = uSpheres[n];
        mat = uMats[n];
        tMin = t;
      }
    }

    N = normalize(P - sphere.xyz);

    vec4 Nt = rayCube(V, W, uCIM);
    if (Nt.w > 0. && Nt.w < tMin) {
      hit = true;
      tMin = Nt.w;
      P = V + tMin * W;
      N = Nt.xyz;
      mat = uMats[numSpheres];
    }

    // If the bounce ray hit something, and would be noticable
    if (hit /*&& prop > 0.0005*/) {

      color += prop * shadeSurface(P, W, N, mat);
      prop *= getMat(mat, 3).y;

      V = P;
      W = 2. * N * dot(N, -W) + W;
      // color += 0.05 * uMats[n][2].rgb * trace(P, R, bounce);
    } else {
      break;
    }
  }
  return color;
}

out vec4 renderedColour;

void main() {

  // FORM THE RAY FOR THIS PIXEL.
  vec3 V = vec3(0., 0., fl);
  vec3 W = normalize(vec3(vPos.xy, -fl));

  // THEN SEE WHAT IT HITS FIRST.
  vec3 t = trace(V, W);
  vec3 color = (t == vec3(0)) ? bgColor : t;

  renderedColour = vec4(sqrt(color), 1.);
}
