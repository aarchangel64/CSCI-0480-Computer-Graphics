// glMatrix Library for fast vector / matrix maths
import "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/3.4.2/gl-matrix-min.js";
const mat4 = glMatrix.mat4;
const vec4 = glMatrix.vec4;
export {cube, sphereMesh}


const glueMeshes = (a, b, size) =>
  a
    .concat(a.slice(-size))
    .concat(b.slice(0, size))
    .concat(b);

/*
   let uvMesh = (f,nu,nv) => {
      let addVertex = V => {
         mesh = mesh.concat(V);
      }
      let mesh = [];
      for (let iv = 0 ; iv < nv ; iv++) {
         let v = iv / nv;
         if (iv > 0)
	    addVertex(f(0,v));
         for (let iu = 0 ; iu <= nu ; iu++) {
	    let u = iu / nu;
	    addVertex(f(u,v));
	    addVertex(f(u,v+1/nv));
	 }
	 addVertex(f(1,v+1/nv));
      }
      return mesh;
   }
*/

function uvMesh(f, nu, nv) {
  let mesh = [];
  for (let iv = 0; iv < nv; iv++) {
    let v = iv / nv;
    let strip = [];
    for (let iu = 0; iu <= nu; iu++) {
      let u = iu / nu;
      strip = strip.concat(f(u, v));
      strip = strip.concat(f(u, v + 1 / nv));
    }
    mesh = glueMeshes(mesh, strip);
  }
  return mesh;
};

function transformMesh(pos, norm, matrix) {
  let result = {
    pos: [],
    norm: []
  };

  let IMT = [];
  mat4.invert(IMT, matrix)
  mat4.transpose(IMT, IMT);

  for (let n = 0; n < pos.length; n += 3) {
    const P = vec4.transformMat4([], pos.slice(n, n + 3).concat(1), matrix);
    const N = vec4.transformMat4([], norm.slice(n, n + 3).concat(0), IMT);
    result.pos = result.pos.concat(P.slice(0, 3));
    result.norm = result.norm.concat(N.slice(0, 3));
  }

  return result;
};


const sphereMesh = uvMesh(
  (u, v) => {
    let theta = 2 * Math.PI * u;
    let phi = Math.PI * v - Math.PI / 2;
    let cu = Math.cos(theta);
    let su = Math.sin(theta);
    let cv = Math.cos(phi);
    let sv = Math.sin(phi);
    return [cu * cv, su * cv, sv, cu * cv, su * cv, sv, u, v];
  },
  20,
  10
);

const squarePos = [
  -1,  1,  0,
  -1, -1,  0,
   1,  1,  0,
   1, -1,  0
];

const squareNorm = [
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1
];

const squareUV = [
  0, 1,
  1, 1,
  0, 0,
  1, 0
];

const face = [];
face[0] = transformMesh(
  squarePos,
  squareNorm,
  mat4.fromTranslation([], [0, 0, 1])
);


{
  const trans = (t) => transformMesh(face[0].pos, face[0].norm, t);

  face[1] = trans(mat4.fromXRotation([], Math.PI / 2));
  face[2] = trans(mat4.fromXRotation([], Math.PI));
  face[3] = trans(mat4.fromXRotation([], -Math.PI / 2));
  face[4] = trans(mat4.fromYRotation([], -Math.PI / 2));
  face[5] = trans(mat4.fromYRotation([], Math.PI / 2));
}

let cube = face.reduce((a, b) => {
  return {
    pos: glueMeshes(a.pos, b.pos, 3),
    norm: glueMeshes(a.norm, b.norm, 3),
    uv: glueMeshes(squareUV, squareUV, 2),
  };
});
