import { compileShader, linkShaders } from "./shaders.js";
export { setupGL, initBuffers, drawScene };

// Heavy guidance from https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html

async function setupGL(gl, canvas) {
  const uri = document.baseURI + "hw1/js/";

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
  const program = linkShaders(gl, vertexShader, fragmentShader);

  // Return program data
  return {
    program: program,
    // Set the locations of shader progam data
    attributes: {
      vertPos: gl.getAttribLocation(program, "aVertPos"),
      colour: gl.getAttribLocation(program, "aColour"),
    },
    uniforms: {
      time: gl.getUniformLocation(program, "uTime"),
      angle: gl.getUniformLocation(program, "uAngle"),
    },
  };
}

function initBuffers(gl) {
  // Convenience format to store vertex position and colour data by hand
  class Vert {
    constructor(pos, col) {
      this.pos = pos;
      this.col = col;
    }
  }

  // Only 4 verticies
  const top = new Vert([0.0, 0.5, 0.0], [100, 230, 14]);
  const left = new Vert([-0.866025, -0.5, -0.5], [255, 156, 25]);
  const right = new Vert([0.866025, -0.5, -0.5], [5, 230, 255]);
  const back = new Vert([0.0, -0.5, 1.0], [201, 5, 255]);

  // Contruct faces from verticies
  const faces = [
    [left, right, top],
    [right, back, top],
    [left, top, back],
    [left, back, right],
  ].flat(2);

  // Create a buffer to store scene geometry and face colour
  const positionBuffer = gl.createBuffer();

  // Bind position and colour buffers to ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(faces.map((f) => f.pos).flat()),
    gl.STATIC_DRAW
  );

  const colourBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array(faces.map((f) => f.col).flat()),
    gl.STATIC_DRAW
  );

  return {
    pos: positionBuffer,
    colour: colourBuffer,
  };
}

// Render Shaders
function drawScene(gl, data, buffers, deltaTime, x, y) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 0.0); // Set clear colour to black
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.CULL_FACE); // Enable culling
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the colour buffer with specified clear colour

  // Use our shader program
  gl.useProgram(data.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  {
    const size = 3; // 3 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      data.attributes.vertPos,
      size,
      type,
      normalize,
      stride,
      offset
    );

    gl.enableVertexAttribArray(data.attributes.vertPos);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colour);

  // Tell the attribute how to get data out of colourBuffer (ARRAY_BUFFER)
  {
    const size = 3; // 3 components per iteration
    const type = gl.UNSIGNED_BYTE; // the data is 32bit floats
    const normalize = true; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer

    gl.vertexAttribPointer(
      data.attributes.colour,
      size,
      type,
      normalize,
      stride,
      offset
    );

    gl.enableVertexAttribArray(data.attributes.colour);
  }

  //  Set time and angle uniforms for animation
  gl.uniform1f(data.uniforms.time, deltaTime);
  gl.uniform2f(data.uniforms.angle, x, y);

  // Draw!
  var primitiveType = gl.TRIANGLES;
  var count = 12;
  gl.drawArrays(primitiveType, 0, count);
}
