if (!window.__AVE_AUDIO__) {

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  function hookMedia() {
    const elements = document.querySelectorAll("audio, video");

    elements.forEach(el => {
      if (!el.__AVE_CONNECTED__) {
        try {
          const source = audioCtx.createMediaElementSource(el);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
          el.__AVE_CONNECTED__ = true;
        } catch (e) {}
      }
    });
  }

  

  // intentar varias veces (porque cargan dinámico)
  setInterval(hookMedia, 1000);

  document.addEventListener("click", () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  });

  window.__AVE_AUDIO__ = analyser;
}