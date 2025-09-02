// ==== SafeLock V2 JS (Aggressive Detection) ====

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

// ===== Aggressive GoGuardian / Monitoring Detection =====
function detectMonitoring() {
  try {
    // Check for known GoGuardian iframes or scripts
    const iframes = document.getElementsByTagName("iframe");
    for (let iframe of iframes) if (iframe.src.includes("goguardian.com")) return true;

    const scripts = document.getElementsByTagName("script");
    for (let script of scripts) if (script.src.includes("goguardian.com")) return true;

    // MutationObserver: check added nodes
    let suspicious = false;
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.tagName === "IFRAME" && node.src.includes("goguardian.com")) suspicious = true;
          if (node.tagName === "SCRIPT" && node.src.includes("goguardian.com")) suspicious = true;
          if (node.style && node.style.display === "none") suspicious = true; // hidden overlays
        });
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Detect suspicious event listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (["keydown","mousemove","click"].includes(type)) suspicious = true;
      originalAddEventListener.call(this, type, listener, options);
    };

    // Detect network requests to monitoring endpoints
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      if (args[0].includes("goguardian.com")) suspicious = true;
      return originalFetch.apply(this, args);
    };
    const originalXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (url.includes("goguardian.com")) suspicious = true;
      return originalXHR.apply(this, arguments);
    };

    return suspicious;
  } catch {
    return false;
  }
}

// Poll every 2 seconds
setInterval(() => {
  if (detectMonitoring()) showMonitorModal();
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
