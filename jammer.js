// ==== Teacher Jammer ====
// Goal: spam fake activity signals so teacher monitoring thinks you're "active" everywhere.

(function () {
  console.log("[Teacher Jammer] Activated");

  function fakeActivity() {
    // Random events to confuse trackers
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    document.dispatchEvent(new MouseEvent("mousemove", { bubbles: true, clientX: Math.random() * 500, clientY: Math.random() * 500 }));
    document.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: Math.random() * 500, clientY: Math.random() * 500 }));

    // Fake visibility API
    Object.defineProperty(document, "hidden", { value: false, configurable: true });
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  }

  // Run every 5 seconds
  setInterval(fakeActivity, 5000);

  // Also fire on load
  fakeActivity();
})();
