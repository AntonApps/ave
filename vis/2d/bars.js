window.AVE_BARS = {
  name: "Bars",

  init() {
    this.peaks = new Array(32).fill(0);
  },

  render(ctx, data, time, canvas) {

    const bars = 32;
    const barWidth = 4;
    const spacing = 2;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#00ffff");
    gradient.addColorStop(0.5, "#0080ff");
    gradient.addColorStop(1, "#001f3f");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bars; i++) {
      const value = data[i];
      const barHeight = value / 2;

      const x = i * (barWidth + spacing);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height, barWidth, -barHeight);

      if (barHeight > this.peaks[i]) {
        this.peaks[i] = barHeight;
      } else {
        this.peaks[i] -= 1.5;
        if (this.peaks[i] < 0) this.peaks[i] = 0;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, canvas.height - this.peaks[i] - 2, barWidth, 2);
    }
  }
};