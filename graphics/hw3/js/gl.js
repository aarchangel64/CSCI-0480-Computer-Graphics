import { compileShader, linkShaders } from "./shaders.js";
export { initGL, drawScene };

// Heavy guidance from https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html

// function to get uniform position
let pos = () => null;

let vao;
let program;

async function initGL(gl, canvas) {
  const uri = document.baseURI + "js/";

  let vertexShader = await compileShader(
    gl,
    uri + "vertex.glsl",
    gl.VERTEX_SHADER
  );

  let fragmentShader = await compileShader(
    gl,
    uri + "frag.glsl",
    gl.FRAGMENT_SHADER
  );

  program = linkShaders(gl, vertexShader, fragmentShader);
  pos = (name) => gl.getUniformLocation(program, name);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(-1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const verts = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];

  // Create a buffer to store scene geometry and face colour
  const positionBuffer = gl.createBuffer();

  // Bind position and colour buffers to ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const vertPos = gl.getAttribLocation(program, "aPos");
  gl.vertexAttribPointer(vertPos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertPos);
}

// Render Shaders
function drawScene(gl, deltaTime, lightCol, sData, cube, cM, mats) {

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Use our shader program
  gl.useProgram(program);
  gl.bindVertexArray(vao);

  //  Set time and angle uniforms for animation
  gl.uniform1f(pos("uTime"), deltaTime);

  // // SPECIFY COLORED KEY LIGHT + FILL LIGHT.
  gl.uniform3fv(pos("uLightsDir"), [0.57, 0.57, 0.57, -0.57, -0.57, -0.57]);
  gl.uniform3fv(pos("uLightCol"), lightCol);

  gl.uniform4fv(pos("uSpheres"), sData.flat());
  gl.uniformMatrix4fv(pos("uMats"), false, mats.flat(2));

  gl.uniform4fv(pos("uCube"), cube);
  gl.uniformMatrix4fv(pos("uCIM"), false, cM);

  // Draw!
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
