// utils.js
// Βασικές βοηθητικές συναρτήσεις για logging, randomization και στατιστικά

// --- Timestamp
const ts = () => new Date().toLocaleTimeString();

// --- Logging
function log(msg) {
  console.log(msg);
  const panel = document.getElementById("activityPanel");
  if (panel) {
    const div = document.createElement("div");
    div.textContent = msg;
    panel.appendChild(div);
    // Κρατάμε μόνο τα τελευταία 50 logs
    while (panel.children.length > MAX_LOGS) panel.removeChild(panel.firstChild);
    panel.scrollTop = panel.scrollHeight;
  }
  updateStats();
}

function logPlayer(pIndex, msg, id=null) {
  const prefix = `Player ${pIndex+1}`;
  const suffix = id ? `: id=${id}` : "";
  log(`[${ts()}] ${prefix} — ${msg}${suffix}`);
}

// --- Στατιστικά
function updateStats() {
  const el = document.getElementById("statsPanel");
  if (el) {
    el.textContent =
      `📊 Stats — AutoNext:${stats.autoNext} | ManualNext:${stats.manualNext} | ` +
      `Shuffle:${stats.shuffle} | Restart:${stats.restart} | Pauses:${stats.pauses} | VolumeChanges:${stats.volumeChanges}`;
  }
}

// --- Randomization helpers
const rndInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
const rndDelayMs = (minS, maxS) => (minS + Math.random() * (maxS - minS)) * 1000;

// --- Επιλογή τυχαίων videos
function getRandomVideos(n) {
  return [...videoList].sort(() => Math.random() - 0.5).slice(0, n);
}
