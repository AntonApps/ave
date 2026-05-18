globalThis.AVE3D = {

  gl: null,
  canvas: null,
  analyser: null,
  currentVis: null,
  data: null,

  visualizers: [],
  currentIndex: 0,

  init(container, analyser) {

    this.analyser = analyser;

    container.innerHTML = "";

    this.canvas = document.createElement("canvas");
    this.canvas.width = 300;
    this.canvas.height = 200;

    container.appendChild(this.canvas);

    this.gl = this.canvas.getContext("webgl");

    if (!this.gl) {
      console.warn("WebGL no soportado");
      return;
    }

    this.data = new Uint8Array(analyser.frequencyBinCount);

    // =========================================
    // 🔥 REGISTRO DE VIS 3D
    // =========================================
    this.visualizers = [
      globalThis.AVE3D_CIRCLE,
      globalThis.AVE3D_TEXT,
      globalThis.AVE3D_TUNNEL
    ].filter(v => v); // evita undefined

    if (this.visualizers.length === 0) {
      console.warn("No hay visualizadores 3D");
      return;
    }

    this.currentIndex = 0;

    // VIS inicial
    this.setVis(this.visualizers[this.currentIndex]);

    // =========================================
    // 🔥 CAMBIO DE VIS (CLICK)
    // =========================================
    this.canvas.addEventListener("click", () => {

      this.currentIndex =
        (this.currentIndex + 1) % this.visualizers.length;

      this.setVis(this.visualizers[this.currentIndex]);

      // feedback visual
      this.canvas.style.outline = "2px solid cyan";
      setTimeout(() => {
        this.canvas.style.outline = "none";
      }, 150);
    });

    this.loop();
  },

  setVis(vis) {

    if (!vis) return;

    this.currentVis = vis;

    // limpiar GL antes de cambiar
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    vis.init(this.gl);
  },

  loop() {

    const renderLoop = (t) => {

      requestAnimationFrame(renderLoop);

      if (!this.currentVis) return;

      this.analyser.getByteFrequencyData(this.data);

      this.currentVis.render(this.gl, this.data, t);
    };

    renderLoop(0);
  }
};