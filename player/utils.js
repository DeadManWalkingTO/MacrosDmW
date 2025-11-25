// utils.js
// Βοηθητικές συναρτήσεις για logging και χρονισμό

// --- Fallback όταν δεν υπάρχει MAX_LOGS από functions.js
const MAX_LOGS_FALLBACK = 50;
function getMaxLogs() {
  return typeof MAX_LOGS === "number" ? MAX_LOGS : MAX_LOGS_FALLBACK;
}

// --- Timestamp helper (HH:MM:SS)
function ts() {
  const now = new Date();
  // Χωρίς 12ωρη μορφή, σταθερό locale για ευθυγράμμιση
  return now.toLocaleTimeString("el-GR", { hour12: false });
}

// --- Logging στο <pre id="log">
function log(msg) {
  try {
    console.log(msg);
  } catch (_) {
    // ignore console errors (π.χ. παλιά browsers)
  }

  const pre = document.getElementById("log");
  if (pre) {
    // Προσθήκη γραμμής με newline όταν χρειάζεται
    pre.textContent = pre.textContent
      ? `${pre.textContent}\n${msg}`
      : `${msg}`;

    // Trim στις τελευταίες MAX_LOGS γραμμές
    const lines = pre.textContent.split("\n");
    const max = getMaxLogs();
    if (lines.length > max) {
      pre.textContent = lines.slice(lines.length - max).join("\n");
    }
  }

  // Προαιρετική ενημέρωση stats, αν υπάρχει
  if (typeof updateStats === "function") {
    try {
      updateStats();
    } catch (e) {
      // Αν αποτύχει, μην μπλοκάρει το log
      console.warn("updateStats failed:", e);
    }
  }
}

// --- Καθαρισμός Activity Log
function clearLogs() {
  const pre = document.getElementById("log");
  if (pre) {
    pre.textContent = "";
  }
  // Μετά τον καθαρισμό, ενημέρωσε τα stats (προαιρετικό)
  if (typeof updateStats === "function") {
    try {
      updateStats();
    } catch (e) {
      console.warn("updateStats failed after clearLogs:", e);
    }
  }
}
