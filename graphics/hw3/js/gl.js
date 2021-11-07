import { compileShader, linkShaders } from "./shaders.js";
export { setupGL, initBuffers, drawScene };

// Heavy guidance from https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html

async function setupGL(gl, canvas) {
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
  return linkShaders(gl, vertexShader, fragmentShader);
}

function initBuffers(gl, verts) {
  // Create a buffer to store scene geometry and face colour
  const positionBuffer = gl.createBuffer();

  // Bind position and colour buffers to ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  return {
    pos: positionBuffer,
  };
}

// Render Shaders
function drawScene(gl, program, buffers, deltaTime, lightCol, sData, cube, cM, mats) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(-1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  // Use our shader program
  gl.useProgram(program);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
  const vertPos = gl.getAttribLocation(program, "aPos");
  gl.vertexAttribPointer(vertPos, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vertPos);

  const pos = (name) => gl.getUniformLocation(program, name);

  //  Set time and angle uniforms for animation
  gl.uniform1f(pos("uTime"), deltaTime);

  // // SPECIFY COLORED KEY LIGHT + FILL LIGHT.
  gl.uniform3fv(pos("uLightsDir"), [0.57, 0.57, 0.57, -0.57, -0.57, -0.57]);
  gl.uniform3fv(pos("uLightCol"), lightCol);

  gl.uniform4fv(pos("uSpheres"), sData.flat());
  gl.uniformMatrix4fv(pos("uMats"), false, mats);

  gl.uniform4fv(pos("uCube"), cube);
  gl.uniformMatrix4fv(pos("uCIM"), false, cM);

  // Draw!
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
