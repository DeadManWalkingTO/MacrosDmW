// --- Versions
const JS_VERSION = "v1.3.4";
const HTML_VERSION = document.querySelector('meta[name="html-version"]')?.content || "unknown";

// --- State
let players = [];
let playerTimers = {}; // timers ανά player index
let videoList = [];
let isMutedAll = true;
let listSource = "Internal"; // Local | Web | Internal
const stats = { autoNext:0, manualNext:0, shuffle:0, restart:0, pauses:0, volumeChanges:0 };

// --- Log settings
const MAX_LOGS = 50;

// --- Internal list (final fallback)
const internalList = [
  "ibfVWogZZhU","mYn9JUxxi0M","sWCTs_rQNy8","JFweOaiCoj4","U6VWEuOFRLQ",
  "ARn8J7N1hIQ","3nd2812IDA4","RFO0NWk-WPw","biwbtfnq9JI","3EXSD6DDCrU",
  "WezZYKX7AAY","AhRR2nQ71Eg","xIQBnFvFTfg","ZWbRPcCbZA8","YsdWYiPlEsE"
];

// --- Config
const START_DELAY_MIN_S = 5, START_DELAY_MAX_S = 180;
const INIT_SEEK_MAX_S = 60;
const UNMUTE_VOL_MIN = 10, UNMUTE_VOL_MAX = 30;
const NORMALIZE_VOLUME_TARGET = 20;
const PAUSE_SMALL_MS = [2000, 5000];
const PAUSE_LARGE_MS = [15000, 30000];
const MID_SEEK_INTERVAL_MIN = [5, 9]; // minutes
const MID_SEEK_WINDOW_S = [30, 120];  // seconds

// --- Utils
const ts = () => new Date().toLocaleTimeString();
function log(msg) {
  console.log(msg);
  const panel = document.getElementById("activityPanel");
  if (panel) {
    const div = document.createElement("div");
    div.textContent = msg;
    panel.appendChild(div);
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
function updateStats() {
  const el = document.getElementById("statsPanel");
  if (el) {
    el.textContent =
      `📊 Stats — AutoNext:${stats.autoNext} | ManualNext:${stats.manualNext} | ` +
      `Shuffle:${stats.shuffle} | Restart:${stats.restart} | Pauses:${stats.pauses} | VolumeChanges:${stats.volumeChanges}`;
  }
}
const rndInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
const rndDelayMs = (minS, maxS) => (minS + Math.random() * (maxS - minS)) * 1000;
function getRandomVideos(n) { return [...videoList].sort(() => Math.random() - 0.5).slice(0, n); }

// --- Load list with triple fallback
function loadVideoList() {
  return fetch("list.txt")
    .then(r => r.ok ? r.text() : Promise.reject(new Error("local-not-found")))
    .then(text => {
      const arr = text.trim().split("\n").map(s => s.trim()).filter(Boolean);
      if (arr.length) { listSource = "Local"; return arr; }
      throw new Error("local-empty");
    })
    .catch(() => {
      return fetch("https://deadmanwalkingto.github.io/MacrosDmW/player/list.txt")
        .then(r => r.ok ? r.text() : Promise.reject(new Error("web-not-found")))
        .then(text => {
          const arr = text.trim().split("\n").map(s => s.trim()).filter(Boolean);
          if (arr.length) { listSource = "Web"; return arr; }
          throw new Error("web-empty");
        })
        .catch(() => { listSource = "Internal"; return internalList; });
    });
}

// --- Kick off
loadVideoList()
  .then(list => {
    videoList = list;
    log(`[${ts()}] 🚀 Project start — HTML ${HTML_VERSION} | JS ${JS_VERSION}`);
    if (typeof YT !== "undefined" && YT.Player) initPlayers(getRandomVideos(8));
  })
  .catch(err => log(`[${ts()}] ❌ List load error: ${err}`));

// --- Reload list
function reloadList() {
  loadVideoList().then(list => {
    videoList = list;
    log(`[${ts()}] 🔄 List reloaded — Source: ${listSource} (Total IDs = ${videoList.length})`);
  }).catch(err => {
    log(`[${ts()}] ❌ Reload failed: ${err}`);
  });
}

// --- YouTube API ready -> init players
function onYouTubeIframeAPIReady() {
  if (videoList.length) {
    initPlayers(getRandomVideos(8));
  } else {
    const check = setInterval(() => {
      if (videoList.length) { clearInterval(check); initPlayers(getRandomVideos(8)); }
    }, 300);
  }
}

// --- Init players με fallback IDs + playerVars
function initPlayers(videoIds) {
  const totalSlots = 8;
  const needed = totalSlots - videoIds.length;
  if (needed > 0) {
    const extra = internalList.slice(0, needed);
    videoIds = [...videoIds, ...extra];
  }

  videoIds.forEach((id, i) => {
    players[i] = new YT.Player(`player${i+1}`, {
      videoId: id,
      playerVars: { rel:0, modestbranding:1 },
      events: { onReady: e => onPlayerReady(e, i), onStateChange: e => onPlayerStateChange(e, i) }
    });
  });

  log(`[${ts()}] ✅ Players initialized (${videoIds.length}) — Source: ${listSource} (Total IDs = ${videoList.length})`);
}

// --- Clear timers για player
function clearPlayerTimers(i) {
  if (playerTimers[i]) {
    playerTimers[i].forEach(t => clearTimeout(t));
    playerTimers[i] = [];
  }
}

function onPlayerReady(e, i) {
  const p = e.target;
  p.mute();
  const startDelay = rndDelayMs(START_DELAY_MIN_S, START_DELAY_MAX_S);
  setTimeout(() => {
    const seek = rndInt(0, INIT_SEEK_MAX_S);
    p.seekTo(seek, true);
    p.playVideo();
    p.setPlaybackQuality('small');
    logPlayer(i, `▶ Start after ${Math.round(startDelay/1000)}s, seek=${seek}s`, p.getVideoData().video_id);
    scheduleRandomPauses(p, i);
    scheduleMidSeek(p, i);
  }, startDelay);
}

function onPlayerStateChange(e, i) {
  if (e.data === YT.PlayerState.ENDED) {
    clearPlayerTimers(i);
    const p = e.target;
    const newId = getRandomVideos(1)[0] || internalList[rndInt(0, internalList.length - 1)];
    p.loadVideoById(newId);
    stats.autoNext++;
    logPlayer(i, "⏭ AutoNext", newId);
    scheduleRandomPauses(p, i);
    scheduleMidSeek(p, i);
  }
}

// --- Natural behaviors με timers
function scheduleRandomPauses(p, i) {
  playerTimers[i] = playerTimers[i] || [];

  const delaySmall = rndDelayMs(30, 120);
  const t1 = setTimeout(() => {
    const pauseLen = rndInt(PAUSE_SMALL_MS[0], PAUSE_SMALL_MS[1]);
    p.pauseVideo(); stats.pauses++;
    logPlayer(i, `⏸ Small pause ${Math.round(pauseLen/1000)}s`, p.getVideoData().video_id);
    const resumeSmall = setTimeout(() => {
      p.playVideo();
      logPlayer(i, "▶ Resume after small pause", p.getVideoData().video_id);
    }, pauseLen);
    playerTimers[i].push(resumeSmall);
  }, delaySmall);
  playerTimers[i].push(t1);

  const delayLarge = rndDelayMs(120, 240);
  const t2 = setTimeout(() => {
    const pauseLen = rndInt(PAUSE_LARGE_MS[0], PAUSE_LARGE_MS[1]);
    p.pauseVideo(); stats.pauses++;
    logPlayer(i, `⏸ Large pause ${Math.round(pauseLen/1000)}s`, p.getVideoData().video_id);
    const resumeLarge = setTimeout(() => {
      p.playVideo();
      logPlayer(i, "▶ Resume after large pause", p.getVideoData().video_id);
    }, pauseLen);
    playerTimers[i].push(resumeLarge);
  }, delayLarge);
  playerTimers[i].push(t2);
}

function scheduleMidSeek(p, i) {
  playerTimers[i] = playerTimers[i] || [];
  const interval = rndInt(MID_SEEK_INTERVAL_MIN[0], MID_SEEK_INTERVAL_MIN[1]) * 60000;
  const t = setTimeout(() => {
    const seek = rndInt(MID_SEEK_WINDOW_S[0], MID_SEEK_WINDOW_S[1]);
    p.seekTo(seek, true);
    logPlayer(i, `⤴ Mid-seek to ${seek}s`, p.getVideoData().video_id);
    scheduleMidSeek(p, i); // επαναδρομή με νέο interval
  }, interval);
  playerTimers[i].push(t);
}

// --- Controls
function playAll() {
  players.forEach((p) => p.playVideo());
  log(`[${ts()}] ▶ Play All`);
}
function pauseAll() {
  players.forEach((p) => p.pauseVideo());
  stats.pauses++;
  log(`[${ts()}] ⏸ Pause All`);
}
function stopAll() {
  players.forEach((p, i) => {
    p.stopVideo();
    clearPlayerTimers(i);
  });
  log(`[${ts()}] ⏹ Stop All`);
}
function nextAll() {
  players.forEach((p, i) => {
    clearPlayerTimers(i);
    const newId = getRandomVideos(1)[0] || internalList[rndInt(0, internalList.length - 1)];
    p.loadVideoById(newId);
    p.playVideo();
    logPlayer(i, "⏭ Next", newId);
    scheduleRandomPauses(p, i);
    scheduleMidSeek(p, i);
  });
  stats.manualNext++;
  log(`[${ts()}] ⏭ Next All`);
}
function shuffleAll() {
  const sh = getRandomVideos(players.length);
  players.forEach((p, i) => {
    const id = sh[i] || internalList[rndInt(0, internalList.length - 1)];
    clearPlayerTimers(i);
    p.loadVideoById(id);
    p.playVideo();
    logPlayer(i, "🎲 Shuffle", id);
    scheduleRandomPauses(p, i);
    scheduleMidSeek(p, i);
  });
  stats.shuffle++;
  log(`[${ts()}] 🎲 Shuffle All`);
}
function restartAll() {
  const set = getRandomVideos(players.length);
  players.forEach((p, i) => {
    const id = set[i] || internalList[rndInt(0, internalList.length - 1)];
    clearPlayerTimers(i);
    p.stopVideo();
    p.loadVideoById(id);
    p.playVideo();
    logPlayer(i, "🔁 Restart", id);
    scheduleRandomPauses(p, i);
    scheduleMidSeek(p, i);
  });
  stats.restart++;
  log(`[${ts()}] 🔁 Restart All`);
}
function toggleMuteAll() {
  if (isMutedAll) {
    players.forEach((p, i) => {
      p.unMute();
      const v = rndInt(UNMUTE_VOL_MIN, UNMUTE_VOL_MAX);
      p.setVolume(v);
      logPlayer(i, `🔊 Enable Sound + Unmute -> ${v}%`, p.getVideoData().video_id);
    });
  } else {
    players.forEach((p, i) => {
      p.mute();
      logPlayer(i, "🔇 Mute", p.getVideoData().video_id);
    });
  }
  isMutedAll = !isMutedAll;
}
function randomizeVolumeAll() {
  players.forEach((p, i) => {
    const v = rndInt(0, 100);
    p.setVolume(v);
    logPlayer(i, `🔊 Volume random -> ${v}%`, p.getVideoData().video_id);
  });
  stats.volumeChanges++;
  log(`[${ts()}] 🔊 Randomize Volume All`);
}
function normalizeVolumeAll() {
  players.forEach((p, i) => {
    p.setVolume(NORMALIZE_VOLUME_TARGET);
    logPlayer(i, `🎚 Volume normalize -> ${NORMALIZE_VOLUME_TARGET}%`, p.getVideoData().video_id);
  });
  stats.volumeChanges++;
  log(`[${ts()}] 🎚 Normalize Volume All`);
}
function toggleTheme() {
  document.body.classList.toggle("light");
  log(`[${ts()}] 🌓 Theme toggled`);
}
function clearLogs() {
  const panel = document.getElementById("activityPanel");
  if (panel) panel.innerHTML = "";
  log(`[${ts()}] 🧹 Logs cleared`);
}
