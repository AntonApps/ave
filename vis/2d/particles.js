window.AVE_PARTICLES = {
  name: "Neon Particles",

  particles: null,

  createParticle(canvas) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 2 + 1
    };
  },

  initParticles(canvas) {
    this.particles = [];
    this.maxParticles = 80;

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle(canvas));
    }
  },

  render(ctx, data, time, canvas) {

    // 🔥 asegurar inicialización
    if (!this.particles) {
      this.initParticles(canvas);
    }

    // fade (trail)
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // energía
    let energy = 0;
    for (let i = 0; i < data.length; i++) {
      energy += data[i];
    }
    energy /= data.length;

    const speedBoost = energy / 100;

    for (let p of this.particles) {

      p.x += p.vx * (1 + speedBoost);
      p.y += p.vy * (1 + speedBoost);

      // rebotes
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      const size = p.size + energy / 100;

      const hue = (time / 20 + p.x) % 360;

      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

      // glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;

      ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }
};