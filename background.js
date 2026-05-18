const api = typeof browser !== "undefined" ? browser : chrome;



setInterval(async () => {

  const { enabled } = await api.storage.local.get("enabled");

  if (enabled === false) return; // 🚫 NO hace nada

  const tabs = await api.tabs.query({ audible: true });

  for (const tab of tabs) {
    try {
      await api.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (document.getElementById("ave-container")) return false;
          return true;
        }
      }).then(async (res) => {

        if (!res[0].result) return;

        await api.scripting.executeScript({
          target: { tabId: tab.id },
          files: [
            "content/audioHook.js",
            "vis/core/visManager.js",
            "vis/2d/bars.js",
            "vis/2d/wave.js",
            "vis/2d/particles.js",
            "vis/2d/trismoke.js",
            "vis/2d/discoBall.js",
            "content/widget.js"
          ]
        });

      });

    } catch (e) {}

  }

}, 2000);
