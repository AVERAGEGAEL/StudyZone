// ==== Network Cloak ====
// Goal: intercept and neutralize suspicious requests (like goguardian.com)

(function () {
  console.log("[Network Cloak] Activated");

  // Block suspicious fetch requests
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const url = args[0].toString();
    if (url.includes("goguardian.com") || url.includes("lightspeed")) {
      console.warn("[Network Cloak] Blocked fetch:", url);
      return new Response("blocked", { status: 204 });
    }
    return originalFetch.apply(this, args);
  };

  // Block suspicious XHR requests
  const originalXHR = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (url.includes("goguardian.com") || url.includes("lightspeed")) {
      console.warn("[Network Cloak] Blocked XHR:", url);
      this.abort();
      return;
    }
    return originalXHR.apply(this, arguments);
  };

  // Periodically jam suspicious iframes
  setInterval(() => {
    const frames = [...document.getElementsByTagName("iframe")];
    frames.forEach(f => {
      if (f.src.includes("goguardian.com") || f.src.includes("lightspeed")) {
        console.warn("[Network Cloak] Removing iframe:", f.src);
        f.remove();
      }
    });
  }, 3000);
})();
