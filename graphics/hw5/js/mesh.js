// glMatrix Library for fast vector / matrix maths
import "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/3.4.2/gl-matrix-min.js";
const mat4 = glMatrix.mat4;
const vec4 = glMatrix.vec4;
export {
	cubeArrays,
	sphereArrays
}

class Mesh {
	constructor(pos = [], norm = [], uv = []) {
		this.pos = pos;
		this.norm = norm;
		this.uv = uv;
	}

	concat(pos, norm, uv) {
		this.pos = this.pos.concat(pos);
		this.norm = this.norm.concat(norm);
		this.uv = this.uv.concat(uv);
	}

	concatMesh(other) {
		this.concat(other.pos, other.norm, other.uv);
	}

	#glueArray = (a, b, size) =>
		a
		.concat(a.slice(-size))
		.concat(b.slice(0, size))
		.concat(b);

	glueMesh(other) {
		this.pos = this.#glueArray(this.pos, other.pos, 3);
		this.norm = this.#glueArray(this.norm, other.norm, 3);
		this.uv = this.#glueArray(this.uv, other.uv, 2);
		return this;
	}
}

const glueMeshes = (a, b, size) =>
	a
	.concat(a.slice(-size))
	.concat(b.slice(0, size))
	.concat(b);


function uvMesh(f, nu, nv) {
	let mesh = new Mesh();
	for (let iv = 0; iv < nv; iv++) {
		let v = iv / nv;
		let strip = new Mesh();
		for (let iu = 0; iu <= nu; iu++) {
			let u = iu / nu;
			strip.concatMesh(f(u, v));
			strip.concatMesh(f(u, v + 1 / nv));
		}
		mesh.glueMesh(strip);
	}
	return mesh;
};

const sphereMesh = uvMesh(
	(u, v) => {
		let theta = 2 * Math.PI * u;
		let phi = Math.PI * v - Math.PI / 2;
		let cu = Math.cos(theta);
		let su = Math.sin(theta);
		let cv = Math.cos(phi);
		let sv = Math.sin(phi);
		return new Mesh([cu * cv, su * cv, sv], [cu * cv, su * cv, sv], [u, v]);
	},
	20,
	10
);

const sphereArrays = {
	Pos: {
		numComponents: 3,
		data: sphereMesh.pos
	},
	Norm: {
		numComponents: 3,
		data: sphereMesh.norm
	},
	UV: {
		numComponents: 2,
		data: sphereMesh.uv
	},
};


function transformMesh(pos, norm, matrix, uv) {
	let result = new Mesh();

	let IMT = [];
	mat4.invert(IMT, matrix)
	mat4.transpose(IMT, IMT);

	for (let n = 0; n < pos.length; n += 3) {
		const P = vec4.transformMat4([], pos.slice(n, n + 3).concat(1), matrix);
		const N = vec4.transformMat4([], norm.slice(n, n + 3).concat(0), IMT);
		result.concat(P.slice(0, 3), N.slice(0, 3), uv);
	}

	return result;
};

const squarePos = [
	-1, 1, 0,
	-1, -1, 0,
	1, 1, 0,
	1, -1, 0
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
	mat4.fromTranslation([], [0, 0, 1]),
	squareUV
);

const trans = (t) => transformMesh(face[0].pos, face[0].norm, t, squareUV);

face[1] = trans(mat4.fromXRotation([], Math.PI / 2));
face[2] = trans(mat4.fromXRotation([], Math.PI));
face[3] = trans(mat4.fromXRotation([], -Math.PI / 2));
face[4] = trans(mat4.fromYRotation([], -Math.PI / 2));
face[5] = trans(mat4.fromYRotation([], Math.PI / 2));

let cube = face.reduce((a, b) => a.glueMesh(b));

const cubeArrays = {
	Pos: {
		numComponents: 3,
		data: cube.pos
	},
	Norm: {
		numComponents: 3,
		data: cube.norm
	},
	UV: {
		numComponents: 2,
		data: cube.uv
	},
};