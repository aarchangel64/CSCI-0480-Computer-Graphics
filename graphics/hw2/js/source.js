async function getCode(id, file) {
  const uri = document.baseURI + "hw2/";
  const response = await fetch(uri + file);
    document.getElementById(id).innerHTML = await response.text();
}

await getCode("frag", "js/frag.glsl");
await getCode("vert", "js/vertex.glsl");
await getCode("main", "js/main.js");
await getCode("gl", "js/gl.js");
hljs.highlightAll();
