const canvas = document.getElementById("vis");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let analyser = null;

// intentar obtener analyser del opener
try {
  analyser = window.opener.__AVE_AUDIO__;
} catch (e) {}

if (!analyser) {
  console.warn("No audio analyser found");
}

const data = new Uint8Array(1024);

function draw() {
  requestAnimationFrame(draw);

  if (!analyser) return;

  analyser.getByteFrequencyData(data);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / 64;

  for (let i = 0; i < 64; i++) {
    const value = data[i];
    const height = value * 2;

    ctx.fillStyle = `hsl(${i * 5}, 100%, 50%)`;

    ctx.fillRect(i * barWidth, canvas.height, barWidth - 2, -height);
  }
}

draw();