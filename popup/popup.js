const api = typeof browser !== "undefined" ? browser : chrome;

const toggle = document.getElementById("toggle");
const statusText = document.getElementById("status-text");
const indicator = document.getElementById("status-indicator");

// cargar estado
api.storage.local.get(["enabled"], (res) => {
  const enabled = res.enabled !== false;

  toggle.checked = enabled;
  updateUI(enabled);
});

// cambiar estado
const toggle3D = document.getElementById("toggle3D");

// cargar estado
api.storage.local.get(["enabled", "mode3D"], (res) => {
  const enabled = res.enabled !== false;
  const mode3D = res.mode3D === true;

  toggle.checked = enabled;
  toggle3D.checked = mode3D;

  updateUI(enabled);
});

// cambiar 3D
toggle3D.addEventListener("change", () => {
  const mode3D = toggle3D.checked;
  api.storage.local.set({ mode3D });
});

// actualizar UI
function updateUI(enabled) {
  if (enabled) {
    statusText.textContent = "Active";
    indicator.style.background = "#00ff88";
  } else {
    statusText.textContent = "Disabled";
    indicator.style.background = "red";
  }
}

// botón más VIS
document.getElementById("moreVis").addEventListener("click", () => {
  // luego puedes cambiar esto a tu web
  window.open("https://antonapps.github.io", "_blank");
});

// botón donaciones
document.getElementById("donate").addEventListener("click", () => {
  window.open("https://www.paypal.com/donate/?hosted_button_id=GCE2N2L4LNQAG", "_blank");
});