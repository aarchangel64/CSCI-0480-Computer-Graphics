precision mediump float;

// Cloud Texture Shader taken from 3D example
float noise(vec3 v) {
   vec4 r[2];
   const mat4 E = mat4(0.,0.,0.,0., 0.,.5,.5,0., .5,0.,.5,0., .5,.5,0.,0.);
   for (int j = 0 ; j < 2 ; j++)
   for (int i = 0 ; i < 4 ; i++) {
      vec3 p = .60*v + E[i].xyz, C = floor(p), P = p - C-.5, A = abs(P), D;
      C += mod(C.x+C.y+C.z+float(j),2.) * step(max(A.yzx,A.zxy),A)*sign(P);
      D  = 314.1*sin(59.2*float(i+4*j) + 65.3*C + 58.9*C.yzx + 79.3*C.zxy);
      r[j][i] = dot(P=p-C-.5,fract(D)-.5) * pow(max(0.,1.-2.*dot(P,P)),4.);
   }
   return 6.50 * (r[0].x+r[0].y+r[0].z+r[0].w+r[1].x+r[1].y+r[1].z+r[1].w);
}

float turbulence(vec3 p) {
  float t = 0., f = 1.;
  for (int i = 0; i < 10; i++) {
    t += abs(noise(f * p)) / f;
    f *= 2.;
  }
  return t;
}

vec3 clouds(float y, vec3 sky) {
  float s = mix(.2, 0., clamp(3. * y - 2., 0., 1.));
  return mix(sky, vec3(s), clamp(.5 * y, 0., 1.));
}

uniform float uTime, uSpace, uX, uY;
varying vec3 vPos;
varying vec3 vColour;

void main() {
   vec3 p = 8. * vPos + vec3(0., 0., .5 * uTime);
   float cloudY = vPos.y + 1.5 * (sin(uTime) + 1.0) * turbulence(p / 10.0);
   vec3 skyMat = clouds(cloudY, vColour);
   // vec3 colour = mix(vColour, skyMat, 0.4 * sin(uTime) + 0.4);
   gl_FragColor = vec4(sqrt(skyMat), 1.);
}
