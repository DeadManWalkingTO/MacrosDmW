// utils.js
// Βοηθητικές συναρτήσεις για logging και stats

// --- Logging
function log(msg) {
  console.log(msg);

  const pre = document.getElementById("log");
  if (pre) {
    // Προσθήκη νέας γραμμής
    pre.textContent = `${pre.textContent}${pre.textContent ? "\n" : ""}${msg}`;

    // Trim στις MAX_LOGS γραμμές
    const lines = pre.textContent.split("\n");
    if (lines.length > MAX_LOGS) {
      pre.textContent = lines.slice(lines.length - MAX_LOGS).join("\n");
    }
  }

  // Ενημέρωση stats μετά από κάθε log
  updateStats();
}

// --- Timestamp helper
function ts() {
  const now = new Date();
  return now.toLocaleTimeString("el-GR", { hour12: false });
}

// --- Stats updater
function updateStats() {
  const list = document.getElementById("stats");
  if (!list) return;

  list.innerHTML = `
    <li>AutoNext: ${stats.autoNext}</li>
    <li>ManualNext: ${stats.manualNext}</li>
    <li>Shuffle: ${stats.shuffle}</li>
    <li>Restart: ${stats.restart}</li>
    <li>Pauses: ${stats.pauses}</li>
    <li>VolumeChanges: ${stats.volumeChanges}</li>
    <li>— HTML ${HTML_VERSION?.startsWith("v") ? HTML_VERSION : `v${HTML_VERSION}`} | JS ${JS_VERSION?.startsWith("v") ? JS_VERSION : `v${JS_VERSION}`}</li>
  `;
}
