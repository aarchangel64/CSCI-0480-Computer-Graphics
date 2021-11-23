export { getMats };

function getMats(gl) {
  let mats = []; // Temp array to hold material data
  let list = {}; // list to return of material indicies

  // this allows for nice syntactical seperation of components
  const newMat = (arr) => mats.push(arr) - 1;

  /*
   * Data Format:
   *    Diffuse Colour,
   *    Ambient Colour,
   *    Specular Colour,
   *    [Specular Power, Reflectivity, None]
   */

  list.copper = newMat([
    [0.15, 0.05, 0.025],
    [0.3, 0.1, 0.05],
    [0.6, 0.2, 0.1],
    [5, 0.05, 0],
  ]);

  list.gold = newMat([
    [0.25, 0.15, 0.025],
    [0.5, 0.3, 0.05],
    [1, 0.6, 0.1],
    // [10, 0.7, 0],
    [10, pick.value / 100, 0],
  ]);

  list.lead = newMat([
    [0.05, 0.05, 0.05],
    [0.1, 0.1, 0.1],
    [1, 1, 1],
    [10, 0.1, 0],
  ]);

  list.plastic = newMat([
    [0.025, 0.0, 0.0],
    [0.5, 0.0, 0.0],
    [2, 2, 2],
    [20, 0.005, 0],
  ]);

  list.mirror = newMat([
    [0.05, 0.01, 0.01],
    [0.11, 0.11, 0.11],
    [0.0, 0.0, 0.0],
    [1, 1.0, 0]
  ])

  // Create a texture to hold material data on the GPU
  // Each material is a row, and each pixel in a row is a vec3 (of float32s)
  const width = mats[0].length;
  const height = mats.length;
  const data = Float32Array.from(mats.flat(2));

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB32F,
    width,
    height,
    0,
    gl.RGB,
    gl.FLOAT,
    data
  );

  // Tell WebGL to not change any pixel values whatsoever
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return list;
}
