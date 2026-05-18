window.AVE_TRISMOKE = {
  name: "Tri Smoke Dance",

  nodes: null,

  initNodes(canvas) {
    this.nodes = [];

    for (let i = 0; i < 3; i++) {
      this.nodes.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: 0,
        vy: 0,
        angle: Math.random() * Math.PI * 2
      });
    }
  },

  render(ctx, data, time, canvas) {

    // inicialización segura
    if (!this.nodes) {
      this.initNodes(canvas);
    }

    // fondo con transparencia → efecto humo
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // calcular energía (bajos + medios)
    let energy = 0;
    for (let i = 0; i < 64; i++) {
      energy += data[i];
    }
    energy /= 64;

    const direction = (energy - 128) / 128; // -1 a 1

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];

      // movimiento base tipo danza circular
      n.angle += 0.02 + (energy / 5000);

      const radius = 20 + energy / 5;

      const targetX = canvas.width / 2 + Math.cos(n.angle + i) * radius;
      const targetY = canvas.height / 2 + Math.sin(n.angle + i) * radius;

      // influencia del audio (izq / der)
      n.vx += (targetX + direction * 50 - n.x) * 0.05;
      n.vy += (targetY - n.y) * 0.05;

      // fricción suave
      n.vx *= 0.9;
      n.vy *= 0.9;

      n.x += n.vx;
      n.y += n.vy;

      // color dinámico
      const hue = (time / 10 + i * 120) % 360;

      // glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, 4 + energy / 50, 0, Math.PI * 2);

      ctx.shadowBlur = 30;
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

      ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }
};