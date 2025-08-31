// ==== SafeLock V2 JS ====

// Load saved values from localStorage
let safeKey = localStorage.getItem("safeKey") || "";
let safeUrl = localStorage.getItem("safeUrl") || "";

// UI elements
const shortcutInput = document.getElementById("shortcutKey");
const urlInput = document.getElementById("safeUrl");
const statusMsg = document.getElementById("statusMsg");
const saveBtn = document.getElementById("saveBtn");
const monitorModal = document.getElementById("monitorModal");
const cloakBtn = document.getElementById("cloakBtn");
const deleteBtn = document.getElementById("deleteBtn");
const stayBtn = document.getElementById("stayBtn");

// Update inputs if available
if (shortcutInput) shortcutInput.value = safeKey;
if (urlInput) urlInput.value = safeUrl;
if (statusMsg && safeKey && safeUrl) {
  statusMsg.textContent = `✅ Safe Lock armed! Press "${safeKey}" anytime to go to ${safeUrl}`;
  statusMsg.style.color = "green";
}

// Save button
if (saveBtn) {
  saveBtn.onclick = () => {
    safeKey = shortcutInput.value.trim().toLowerCase();
    safeUrl = urlInput.value.trim();

    if (!safeKey || !safeUrl) {
      if (statusMsg) {
        statusMsg.textContent = "❌ Please enter both a shortcut key and URL.";
        statusMsg.style.color = "red";
      }
      return;
    }

    localStorage.setItem("safeKey", safeKey);
    localStorage.setItem("safeUrl", safeUrl);

    if (statusMsg) {
      statusMsg.textContent = `✅ Safe Lock armed! Press "${safeKey}" anytime to go to ${safeUrl}`;
      statusMsg.style.color = "green";
    }
  };
}

// Global shortcut listener (emergency)
document.addEventListener("keydown", e => {
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

  const key = localStorage.getItem("safeKey");
  const url = localStorage.getItem("safeUrl");
  if (!key || !url) return;

  if (e.key.toLowerCase() === key) {
    window.open(url, "_blank");
    try {
      window.open("about:blank", "_self");
      window.close();
    } catch {}
  }
});

// ===== GoGuardian / monitoring detection =====
// Example: basic polling for known monitoring iframe or element
function detectMonitoring() {
  // Look for known GoGuardian iframe patterns (can expand later)
  const iframes = document.getElementsByTagName("iframe");
  for (let iframe of iframes) {
    if (iframe.src.includes("goguardian.com")) {
      return true;
    }
  }

  // Optionally check scripts
  const scripts = document.getElementsByTagName("script");
  for (let script of scripts) {
    if (script.src.includes("goguardian.com")) {
      return true;
    }
  }

  return false;
}

// Poll every 2 seconds
setInterval(() => {
  if (detectMonitoring()) {
    showMonitorModal();
  }
}, 2000);

// ===== Modal =====
function showMonitorModal() {
  if (!monitorModal) return;
  monitorModal.style.display = "flex";
}

// Cloak: open full-screen iframe to educational site (Desmos by default)
if (cloakBtn) {
  cloakBtn.onclick = () => {
    const baseTitle = document.title || "Educational Site";
    const baseFavicon = document.querySelector("link[rel*='icon']")?.href || "desmos.png";

    const popup = window.open("about:blank", "_blank");
    popup.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${baseTitle}</title>
        <link rel="icon" href="${baseFavicon}" type="image/png">
        <style>
          body, html { margin:0; padding:0; height:100%; overflow:hidden; }
          iframe { position:fixed; top:0; left:0; width:100%; height:100%; border:none; }
        </style>
      </head>
      <body>
        <iframe src="https://www.desmos.com/calculator"></iframe>
        <script>
          document.addEventListener("contextmenu", e => e.preventDefault());
        <\/script>
      </body>
      </html>
    `);
    popup.document.close();
    monitorModal.style.display = "none";
  };
}

// Delete: old Safe Lock method
if (deleteBtn) {
  deleteBtn.onclick = () => {
    const url = localStorage.getItem("safeUrl") || "about:blank";
    window.open(url, "_blank");
    try { window.open("about:blank", "_self"); window.close(); } catch {}
    monitorModal.style.display = "none";
  };
}

// Stay: just hide modal
if (stayBtn) {
  stayBtn.onclick = () => {
    monitorModal.style.display = "none";
  };
}