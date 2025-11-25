// utils.js

const MAX_LOGS_FALLBACK = 50;
function getMaxLogs() {
  return (typeof MAX_LOGS === "number" && MAX_LOGS > 0) ? MAX_LOGS : MAX_LOGS_FALLBACK;
}

function ts() {
  const now = new Date();
  return now.toLocaleTimeString("el-GR", { hour12: false });
}

function log(msg) {
  console.log(msg);
  const pre = document.getElementById("log");
  if (pre) {
    pre.textContent = pre.textContent
      ? `${pre.textContent}\n${msg}`
      : `${msg}`;
    const lines = pre.textContent.split("\n");
    const max = getMaxLogs();
    if (lines.length > max) {
      pre.textContent = lines.slice(lines.length - max).join("\n");
    }
  }
  if (typeof updateStats === "function") {
    try { updateStats(); } catch (e) { console.warn("updateStats failed:", e); }
  }
}

function clearLogs() {
  const pre = document.getElementById("log");
  if (pre) pre.textContent = "";
  if (typeof updateStats === "function") {
    try { updateStats(); } catch (e) { console.warn("updateStats failed after clearLogs:", e); }
  }
}
