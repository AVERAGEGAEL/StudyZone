// settings-loader.js

// List of hidden scripts/tools
const hiddenTools = [
  { name: "Network Cloak", id: "networkCloak", src: "network-cloak.js" },
  { name: "Teacher Jammer", id: "teacherJammer", src: "teacher-jammer.js" },
  { name: "SafeLock v2", id: "safeLock", src: "safelock.js" }
];

// Function to inject a script dynamically
function loadScript(id, src) {
  if (!document.getElementById(id)) {
    const script = document.createElement("script");
    script.src = src;
    script.id = id;
    document.body.appendChild(script);
  }
}

// Function to remove script
function removeScript(id) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
}

// Render settings page
function renderSettings() {
  const main = document.querySelector("main");
  if (!main) return;

  // Build settings UI
  let html = `<div class="card"><h2>⚙️ Settings</h2><p>Enable or disable hidden tools:</p><ul>`;
  hiddenTools.forEach(tool => {
    const enabled = localStorage.getItem(tool.id) === "true";
    html += `
      <li>
        <label>
          <input type="checkbox" id="chk-${tool.id}" ${enabled ? "checked" : ""}>
          ${tool.name}
        </label>
      </li>`;
  });
  html += `</ul></div>`;

  main.innerHTML = html;

  // Add event listeners for checkboxes
  hiddenTools.forEach(tool => {
    const checkbox = document.getElementById(`chk-${tool.id}`);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        localStorage.setItem(tool.id, "true");
        loadScript(tool.id, tool.src);
      } else {
        localStorage.setItem(tool.id, "false");
        removeScript(tool.id);
      }
    });
  });
}

// Auto-load scripts based on saved settings
function initHiddenTools() {
  hiddenTools.forEach(tool => {
    if (localStorage.getItem(tool.id) === "true") {
      loadScript(tool.id, tool.src);
    }
  });
}

// If we are on settings.html, render UI
if (window.location.pathname.endsWith("settings.html")) {
  document.addEventListener("DOMContentLoaded", renderSettings);
}

// Always initialize hidden tools
document.addEventListener("DOMContentLoaded", initHiddenTools);
