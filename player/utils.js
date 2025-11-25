/* utils.js v1.1
 * Βοηθητικές συναρτήσεις: logging, randomization, στατιστικά
 */

// Logging helpers
function logInfo(msg) {
  console.log("[INFO] " + msg);
}

function logError(msg) {
  console.error("[ERROR] " + msg);
}

function logDebug(msg) {
  console.debug("[DEBUG] " + msg);
}

// Randomization helpers
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

// Stats tracking
let stats = {
  plays: 0,
  pauses: 0,
  restarts: 0,
  shuffles: 0,
  mutes: 0
};

function updateStats(action) {
  if (stats.hasOwnProperty(action)) {
    stats[action]++;
    logInfo("Stats updated: " + action + " = " + stats[action]);
  } else {
    logError("Unknown stats action: " + action);
  }
}

function getStats() {
  return { ...stats };
}

// Export για χρήση από άλλα modules
export { logInfo, logError, logDebug, getRandomInt, getRandomElement, updateStats, getStats };
