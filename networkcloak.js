// ==== Network Cloak ====
// Purpose: Generate fake traffic + disguise StudyZone activity
// Loaded only if enabled in settings.html

(function() {
  console.log("[Network Cloak] Activated");

  // List of safe decoy URLs
  const decoys = [
    "https://www.khanacademy.org",
    "https://www.wikipedia.org",
    "https://www.desmos.com",
    "https://www.nasa.gov",
    "https://www.nationalgeographic.com"
  ];

  // Periodically make harmless HEAD requests
  function sendDecoy() {
    const url = decoys[Math.floor(Math.random() * decoys.length)];
    fetch(url, { method: "HEAD", mode: "no-cors" }).catch(() => {});
    console.log("[Network Cloak] Sent decoy request to", url);
  }

  // Mask activity with randomized timing
  setInterval(sendDecoy, Math.floor(Math.random() * 5000) + 3000);

  // Spoof navigator object (basic disguise)
  const spoof = {
    platform: "Win32",
    vendor: "Google Inc.",
    language: "en-US"
  };
  Object.assign(navigator, spoof);
})();
