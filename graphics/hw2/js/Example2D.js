import { setupCanvas } from "./canvas.js";

// Make canvas pixel resolution match CSS resolution
const canvas = setupCanvas("2DCanvas");
const ctx = canvas.getContext("2d");

// Co-ordinate scaling functions, for scaling 0.0 - 1.0 to canvas pixel space
const sX = (x) => x * canvas.width;
const sY = (y) => y * canvas.height;

// Function that runs on every frame
function render(now) {
  now *= 0.001; // Convert milliseconds to seconds

  // Set background colour
  ctx.clearRect(sX(0), sY(0), sX(1), sY(1));
  ctx.fillStyle = "rgb(33, 37, 41)";
  ctx.fillRect(sX(0), sY(0), sX(1), sY(1));

  ctx.fillStyle = "white";
  const n = 32;
  let w = 0.3;
  let h = 0.3;

  // Draw balls
  for (let i = 0; i < n; i++) {
    let x = sX(0.5 + w * Math.cos(now * (2 * i * Math.PI) / n));
    let y = sY(0.5 + h * Math.sin(now + (2 * i * Math.PI) / n));

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2, true);
    ctx.fill();
  }

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
