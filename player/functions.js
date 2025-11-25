// functions.js
// Κεντρικό orchestrator του project

// --- State
let players = [];
let playerTimers = {};
let videoList = [];
let isMutedAll = true;
let listSource = "Internal"; // Local | Web | Internal

// --- Initialization
loadVideoList()
  .then(list => {
    videoList = list;
    log(`[${ts()}] 🚀 Project start — HTML ${HTML_VERSION} | JS ${JS_VERSION}`);
    if (typeof YT !== "undefined" && YT.Player) {
      initPlayers(getRandomVideos(8));
    }

    // Μετά το initialization, πρόσθεσε την έκδοση στο Stats panel
    const statsPanel = document.getElementById("statsPanel");
    if (statsPanel) {
      const versionInfo = document.createElement("div");
      versionInfo.textContent = `— HTML ${HTML_VERSION} | JS ${JS_VERSION}`;
      statsPanel.appendChild(versionInfo);
    }
  })
  .catch(err => log(`[${ts()}] ❌ List load error: ${err}`));

// --- Utility
function getRandomVideos(count) {
  const shuffled = [...videoList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// --- Player initialization
function initPlayers(videoIds) {
  const container = document.getElementById("players");
  container.innerHTML = "";
  players = [];

  videoIds.forEach((id, idx) => {
    const div = document.createElement("div");
    div.id = `player${idx + 1}`;
    container.appendChild(div);

    const player = new YT.Player(div.id, {
      videoId: id,
      events: {
        onReady: () => log(`[${ts()}] ✅ Player ${idx + 1} ready — id=${id}`),
        onStateChange: e => handlePlayerStateChange(e, idx + 1, id)
      }
    });

    players.push(player);
  });

  log(`[${ts()}] ✅ Players initialized (${players.length}) — Source: ${listSource} (Total IDs = ${videoList.length})`);
}

// --- Player state handler
function handlePlayerStateChange(event, playerIndex, videoId) {
  if (event.data === YT.PlayerState.PLAYING) {
    log(`[${ts()}] ▶ Player ${playerIndex} started — id=${videoId}`);
  } else if (event.data === YT.PlayerState.PAUSED) {
    log(`[${ts()}] ⏸ Player ${playerIndex} paused — id=${videoId}`);
  } else if (event.data === YT.PlayerState.ENDED) {
    log(`[${ts()}] ⏭ Player ${playerIndex} ended — id=${videoId}`);
    const nextId = getRandomVideos(1)[0];
    event.target.loadVideoById(nextId);
    log(`[${ts()}] 🔀 Player ${playerIndex} next — id=${nextId}`);
  }
}
