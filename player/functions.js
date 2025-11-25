// functions.js
// Κεντρικό orchestrator του project

// --- Versions
const HTML_VERSION = document.querySelector('meta[name="html-version"]')?.content || "unknown";
const JS_VERSION = "v2.1.1"; // χειροκίνητη έκδοση JS ΜΟΝΟ εδώ

// --- Log settings
const MAX_LOGS = 50; // μέγιστος αριθμός γραμμών στο Activity Log

// --- Helpers
function formatVersion(v) {
  if (!v) return "vunknown";
  return v.startsWith("v") ? v : `v${v}`;
}

// --- State
let players = [];
let playerTimers = {};
let videoList = [];
let isMutedAll = true;
let listSource = "Internal"; // Local | Web | Internal

const stats = {
  autoNext: 0,
  manualNext: 0,
  shuffle: 0,
  restart: 0,
  pauses: 0,
  volumeChanges: 0
};

// --- Kick off project
loadVideoList()
  .then(list => {
    videoList = list;
    log(`[${ts()}] 🚀 Project start — HTML ${formatVersion(HTML_VERSION)} | JS ${formatVersion(JS_VERSION)}`);
    if (typeof YT !== "undefined" && YT.Player) {
      initPlayers(getRandomVideos(8));
    } else {
      log(`[${ts()}] ⚠️ YT API not ready yet`);
    }
    updateStats(); // ενημέρωση stats στην εκκίνηση
  })
  .catch(err => log(`[${ts()}] ❌ List load error: ${err}`));

// --- Utility
function getRandomVideos(count) {
  const shuffled = [...videoList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// --- Player initialization (div-based, Option A)
function initPlayers(videoIds) {
  const container = document.querySelector(".player-container");
  players = [];

  videoIds.forEach((id, idx) => {
    const player = new YT.Player(`player${idx + 1}`, {
      videoId: id,
      events: {
        onReady: () => log(`[${ts()}] ✅ Player ${idx + 1} ready — id=${id}`),
        onStateChange: e => handlePlayerStateChange(e, idx + 1, id)
      }
    });
    players.push(player);
  });

  log(`[${ts()}] ✅ Players initialized (${players.length}/${videoIds.length}) — Source: ${listSource} (Total IDs = ${videoList.length})`);
}

// --- Player state handler
function handlePlayerStateChange(event, playerIndex, videoId) {
  if (event.data === YT.PlayerState.PLAYING) {
    log(`[${ts()}] ▶ Player ${playerIndex} started — id=${videoId}`);
  } else if (event.data === YT.PlayerState.PAUSED) {
    stats.pauses++;
    updateStats();
    log(`[${ts()}] ⏸ Player ${playerIndex} paused — id=${videoId}`);
  } else if (event.data === YT.PlayerState.ENDED) {
    stats.autoNext++;
    updateStats();
    log(`[${ts()}] ⏭ Player ${playerIndex} ended — id=${videoId}`);

    const nextId = getRandomVideos(1)[0];
    if (nextId) {
      event.target.loadVideoById(nextId);
      log(`[${ts()}] 🔀 Player ${playerIndex} next — id=${nextId}`);
    } else {
      log(`[${ts()}] ⚠️ No next video available`);
    }
  }
}

// --- Stats updater
function updateStats() {
  const statsList = document.getElementById("stats");
  if (!statsList) return;

  statsList.innerHTML = `
    <li>AutoNext: ${stats.autoNext}</li>
    <li>ManualNext: ${stats.manualNext}</li>
    <li>Shuffle: ${stats.shuffle}</li>
    <li>Restart: ${stats.restart}</li>
    <li>Pauses: ${stats.pauses}</li>
    <li>VolumeChanges: ${stats.volumeChanges}</li>
    <li>— HTML ${formatVersion(HTML_VERSION)} | JS ${formatVersion(JS_VERSION)}</li>
  `;
}
