// utils.js
// Βοηθητικές συναρτήσεις για logging και χρονισμό

// --- Fallback όταν δεν υπάρχει MAX_LOGS από functions.js
const MAX_LOGS_FALLBACK = 50;
function getMaxLogs() {
  return (typeof MAX_LOGS === "number" && MAX_LOGS > 0) ? MAX_LOGS : MAX_LOGS_FALLBACK;
}

// --- Timestamp helper (HH:MM:SS)
function ts() {
  const now = new Date();
  return now.toLocaleTimeString("el-GR", { hour12: false });
}

// --- Logging στο <pre id="log">
function log(msg) {
  // Console echo
  try { console.log(msg); } catch (_) {}

  // UI log
  const pre = document.getElementById("log");
  if (pre) {
    const needsNewline = pre.textContent && !pre.textContent.endsWith("\n");
    pre.textContent = needsNewline ? `${pre.textContent}\n${msg}` : `${pre.textContent}${msg}`;

    // Trim στις τελευταίες MAX_LOGS γραμμές
    const lines = pre.textContent.split("\n");
    const max = getMaxLogs();
    if (lines.length > max) {
      pre.textContent = lines.slice(lines.length - max).join("\n");
    }
  }

  // Προαιρετική ενημέρωση stats
  if (typeof updateStats === "function") {
    try { updateStats(); } catch (e) { try { console.warn("updateStats failed:", e); } catch (_) {} }
  }
}

// --- Καθαρισμός Activity Log
function clearLogs() {
  const pre = document.getElementById("log");
  if (pre) pre.textContent = "";

  if (typeof updateStats === "function") {
    try { updateStats(); } catch (e) { try { console.warn("updateStats failed after clearLogs:", e); } catch (_) {} }
  }
}
