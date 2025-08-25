// Load saved values from localStorage
let safeKey = localStorage.getItem("safeKey") || "";
let safeUrl = localStorage.getItem("safeUrl") || "";

// Optional: update UI if this page has Safe Lock inputs
const shortcutInput = document.getElementById("shortcutKey");
const urlInput = document.getElementById("safeUrl");
const statusMsg = document.getElementById("statusMsg");

if (shortcutInput) shortcutInput.value = safeKey;
if (urlInput) urlInput.value = safeUrl;
if (statusMsg && safeKey && safeUrl) {
  statusMsg.textContent = `✅ Safe Lock armed! Press "${safeKey}" anytime to go to ${safeUrl}`;
  statusMsg.style.color = "green";
}

// Save button functionality (if exists on page)
const saveBtn = document.getElementById("saveBtn");
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

// Global shortcut listener for all pages
document.addEventListener("keydown", e => {
  // Ignore typing in inputs/textareas
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) return;

  // Always fetch latest from localStorage
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
