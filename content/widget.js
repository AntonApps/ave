(function () {

  const api = typeof browser !== "undefined" ? browser : chrome;

  let use3D = false;

  api.storage.local.get("mode3D", (res) => {
    use3D = res.mode3D === true;
    init();
  });

  function init() {

    if (document.getElementById("ave-container")) return;

    const analyser = window.__AVE_AUDIO__;
    if (!analyser) return;

    // 🔥 CONTENEDOR
    const container = document.createElement("div");
    container.id = "ave-container";

    Object.assign(container.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 999999,
      background: "rgba(0,0,0,0.3)",
      backdropFilter: "blur(6px)",
      borderRadius: "12px",
      cursor: "move",
      overflow: "hidden"
    });

    document.body.appendChild(container);

    // 🎨 CANVAS 2D
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 120;

    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    // =========================
    // 🔥 MODO 3D (WEBGL)
    // =========================
if (use3D) {

  console.log("AVE: modo 3D limpio");

  if (!globalThis.AVE3D) {
    console.warn("AVE3D no disponible");
    return;
  }

  AVE3D.init(container, analyser);
} else {

      // =========================
      // 🎨 MODO 2D (AVE)
      // =========================

      console.log("AVE: modo 2D");

      AVE.register(window.AVE_BARS);
      AVE.register(window.AVE_WAVE);
      AVE.register(window.AVE_PARTICLES);
      AVE.register(window.AVE_TRISMOKE);
      AVE.register(window.AVE_DISCO);

      AVE.loadSaved();
      AVE.setVis(AVE.visualizers[AVE.currentIndex], canvas);

      function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(data);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        AVE.render(ctx, data, performance.now(), canvas);

        ctx.fillStyle = "white";
        ctx.font = "10px Arial";
        ctx.fillText(
          AVE.currentVis?.name || "",
          5,
          10
        );
      }

      draw();
    }

    // =========================
    // 🖱️ DRAG
    // =========================

    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - container.getBoundingClientRect().left;
      offsetY = e.clientY - container.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        container.style.left = (e.clientX - offsetX) + "px";
        container.style.top = (e.clientY - offsetY) + "px";
        container.style.bottom = "auto";
        container.style.right = "auto";
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // =========================
    // 🔲 FULLSCREEN
    // =========================

    container.ondblclick = () => {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    };

    function resizeCanvas() {
      if (document.fullscreenElement === container) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        canvas.width = 200;
        canvas.height = 120;
      }
    }

    document.addEventListener("fullscreenchange", resizeCanvas);
    window.addEventListener("resize", resizeCanvas);

    // =========================
    // 🔄 CAMBIO VIS (solo 2D)
    // =========================

    container.addEventListener("click", () => {

      if (use3D) return;

      AVE.next(canvas);

      container.style.border = "2px solid cyan";
      setTimeout(() => {
        container.style.border = "none";
      }, 200);
    });
  }

})();