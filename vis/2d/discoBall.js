console.log("discoBall3D cargado");
globalThis.AVE_3D = {
  name: "Disco Mirror Ball",

  points: null,
  rotation: 0,

  init(canvas) {
    this.points = [];
    this.rotation = 0;

    const numPoints = 400;
    const radius = 50;

    for (let i = 0; i < numPoints; i++) {

      // distribución en esfera
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      this.points.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi)
      });
    }
  },

  render(ctx, data, time, canvas) {

    if (!this.points) {
      this.init(canvas);
    }

    // limpiar con leve fade
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // energía
    let energy = 0;
    for (let i = 0; i < data.length; i++) {
      energy += data[i];
    }
    energy /= data.length;

    // velocidad de rotación depende del audio
    this.rotation += 0.01 + (energy / 5000);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let p of this.points) {

      // rotación eje Y
      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);

      const x = p.x * cos - p.z * sin;
      const z = p.x * sin + p.z * cos;

      const y = p.y;

      // proyección simple
      const scale = 1 + z / 100;
      const px = cx + x * scale;
      const py = cy + y * scale;

      // brillo según profundidad + audio
      const brightness = 150 + (z * 2) + energy;

      const size = 2 * scale;

      ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;

      ctx.fillRect(px, py, size, size);
      
    }

    // glow central (toque disco 🔥)
    ctx.beginPath();
    ctx.arc(cx, cy, 8 + energy / 20, 0, Math.PI * 2);
    const hue = (time / 20) % 360;
    ctx.fillStyle = `hsl(${hue}, 100%, ${50 + energy / 5}%)`;
    //ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fill();
  }
};