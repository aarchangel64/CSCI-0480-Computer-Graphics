export { setupCanvas };

function setupCanvas(id) {
  const canvas = document.getElementById(id);
  const scale = window.devicePixelRatio;

  // Setup an observer to fit the canvas to the entire window
  // From https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      // See https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
      if (entry.contentBoxSize) {
        // Firefox implements `contentBoxSize` as a single content rect, rather than an array
        const contentBoxSize = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize;

        canvas.width = contentBoxSize.inlineSize * scale;
        canvas.height = contentBoxSize.blockSize * scale;
      } else {
        canvas.width = entry.contentRect.width * scale;
        canvas.height = entry.contentRect.height * scale;
      }
    }
  });
  resizeObserver.observe(canvas, { box: "content-box" });

  return canvas;
}
