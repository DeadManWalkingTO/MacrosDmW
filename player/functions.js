// functions.js

const HTML_VERSION = document.querySelector('meta[name="html-version"]')?.content || "unknown";
const JS_VERSION = "v2.1.1";
const MAX_LOGS = 50;

function formatVersion(v) {
  if (!v) return "vunknown";
  return v.startsWith("v") ? v : `v${v}`;
}

let players = [];
let videoList = [];
let isMutedAll = true;
let listSource = "Internal";

const stats = {
  autoNext: 0,
  manualNext: 0,
  shuffle: 0,
  restart: 0,
  pauses: 0,
  volumeChanges: 0
};

loadVideoList()
  .then(list => {
    videoList = list;
    log(`[${ts()}] 🚀 Project start — HTML ${formatVersion(HTML_VERSION)} | JS ${formatVersion(JS_VERSION)}`);
    if (typeof YT !== "undefined" && YT.Player) {
      initPlayers(getRandomVideos(8));
    }
    updateStats();
  })
  .catch(err => log(`[${ts()}] ❌ List load error: ${err}`));

function getRandomVideos(count) {
  const shuffled = [...videoList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function initPlayers(videoIds) {
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
    }
  }
}

// Stats σε μία γραμμή
function updateStats() {
  const statsDiv = document.getElementById("stats");
  if (!statsDiv) return;

  statsDiv.textContent =
    `Stats | AutoNext: ${stats.autoNext} | ` +
    `ManualNext: ${stats.manualNext} | ` +
    `Shuffle: ${stats.shuffle} | ` +
    `Restart: ${stats.restart} | ` +
    `Pauses: ${stats.pauses} | ` +
    `VolumeChanges: ${stats.volumeChanges} | ` +
    `HTML ${formatVersion(HTML_VERSION)} | JS ${formatVersion(JS_VERSION)}`;
}
