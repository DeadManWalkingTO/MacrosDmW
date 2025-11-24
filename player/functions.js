// --- State
let players = [];
let videoList = [];
let isMutedAll = true;
const stats = { autoNext: 0, manualNext: 0, shuffle: 0, restart: 0, pauses: 0, volumeChanges: 0 };

// --- Internal list (final fallback)
const internalList = [
  "ibfVWogZZhU", "mYn9JUxxi0M", "sWCTs_rQNy8", "JFweOaiCoj4", "U6VWEuOFRLQ",
  "ARn8J7N1hIQ", "3nd2812IDA4", "RFO0NWk-WPw", "biwbtfnq9JI", "3EXSD6DDCrU",
  "WezZYKX7AAY", "AhRR2nQ71Eg", "xIQBnFvFTfg", "ZWbRPcCbZA8", "YsdWYiPlEsE"
];

// --- Config
const START_DELAY_MIN_S = 5, START_DELAY_MAX_S = 180;
const INIT_SEEK_MAX_S = 60;
const UNMUTE_VOL_MIN = 10, UNMUTE_VOL_MAX = 30;
const NORMALIZE_VOLUME_TARGET = 20;
const PAUSE_SMALL_MS = [2000, 5000];
const PAUSE_LARGE_MS = [15000, 30000];
const MID_SEEK_INTERVAL_MIN = [5, 9];
const MID_SEEK_WINDOW_S = [30, 120];

// --- Utils
const ts = () => new Date().toLocaleTimeString();
function log(msg) {
  console.log(msg);
  const panel = document.getElementById("activityPanel");
  if (panel) {
    const div = document.createElement("div");
    div.textContent = msg;
    panel.appendChild(div);
    panel.scrollTop = panel.scrollHeight;
  }
  updateStats();
}
function updateStats() {
  const el = document.getElementById("statsPanel");
  if (el) {
    el.textContent = `📊 Stats — AutoNext:${stats.autoNext} | ManualNext:${stats.manualNext} | Shuffle:${stats.shuffle} | Restart:${stats.restart} | Pauses:${stats.pauses} | VolumeChanges:${stats.volumeChanges}`;
  }
}
const rndInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
const rndDelayMs = (minS, maxS) => (minS + Math.random() * (maxS - minS)) * 1000;
function getRandomVideos(n) { return [...videoList].sort(() => Math.random() - 0.5).slice(0, n); }

// --- Load list with triple fallback: local -> remote -> internal
function loadVideoList() {
  // 1. Local list.txt
  return fetch("list.txt")
    .then(r => r.ok ? r.text() : Promise.reject("Local list.txt not found"))
    .then(text => {
      const arr = text.trim().split("\n").filter(Boolean);
      if (arr.length) return arr;
      throw "Local list.txt empty";
    })
    .catch(() => {
      // 2. Remote fallback (GitHub Pages)
      log(`[${ts()}] ⚠ Using remote fallback list.txt`);
      return fetch("https://deadmanwalkingto.github.io/MacrosDmW/player/list.txt")
        .then(r => r.ok ? r.text() : Promise.reject("Remote list.txt not found"))
        .then(text => {
          const arr = text.trim().split("\n").filter(Boolean);
          if (arr.length) return arr;
          throw "Remote list.txt empty";
        })
        .catch(() => {
          // 3. Internal list
          log(`[${ts()}] ⚠ Using internal IDs list`);
          return internalList;
        });
    });
}

// --- Kick off list loading
loadVideoList().then(list => {
  videoList = list;
  if (typeof YT !== "undefined" && YT.Player) {
    initPlayers(getRandomVideos(8));
  }
}).catch(err => {
  log(`[${ts()}] ❌ List load error: ${err}`);
});

// --- YouTube API ready -> init players
function onYouTubeIframeAPIReady() {
  if (videoList.length) {
    initPlayers(getRandomVideos(8));
  } else {
    const check = setInterval(() => {
      if (videoList.length) {
        clearInterval(check);
        initPlayers(getRandomVideos(8));
      }
    }, 300);
  }
}

function initPlayers(videoIds) {
  videoIds.forEach((id, i) => {
    players[i] = new YT.Player(`player${i + 1}`, {
      videoId: id,
      events: { onReady: onPlayerReady, onStateChange: onPlayerStateChange }
    });
  });
  log(`[${ts()}] ✅ Players initialized (${videoIds.length})`);
}

function onPlayerReady(e) {
  const p = e.target;
  p.mute();
  const startDelay = rndDelayMs(START_DELAY_MIN_S, START_DELAY_MAX_S);
  setTimeout(() => {
    const seek = rndInt(0, INIT_SEEK_MAX_S);
    p.seekTo(seek, true);
    p.playVideo();
    p.setPlaybackQuality('small');
    log(`[${ts()}] ▶ Start after ${Math.round(startDelay / 1000)}s: id=${p.getVideoData().video_id}, seek=${seek}s`);
    scheduleRandomPauses(p);
    scheduleMidSeek(p);
  }, startDelay);
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.ENDED) {
    const p = e.target;
    const newId = getRandomVideos(1)[0];
    p.loadVideoById(newId);
    stats.autoNext++;
    log(`[${ts()}] ⏭ AutoNext: ${newId}`);
    scheduleRandomPauses(p);
    scheduleMidSeek(p);
  }
}

// --- Natural behaviors
function scheduleRandomPauses(p) {
  const delaySmall = rndDelayMs(30, 120);
  setTimeout(() => {
    const pauseLen = rndInt(PAUSE_SMALL_MS[0], PAUSE_SMALL_MS[1]);
    p.pauseVideo(); stats.pauses++;
    log(`[${ts()}] ⏸ Small pause ${Math.round(pauseLen / 1000)}s: id=${p.getVideoData().video_id}`);
    setTimeout(() => { p.playVideo(); log(`[${ts()}] ▶ Resume after small pause`); }, pauseLen);
  }, delaySmall);

  const delayLarge = rndDelayMs(120, 240);
  setTimeout(() => {
    const pauseLen = rndInt(PAUSE_LARGE_MS[0], PAUSE_LARGE_MS[1]);
    p.pauseVideo(); stats.pauses++;
    log(`[${ts()}] ⏸ Large pause ${Math.round(pauseLen / 1000)}s: id=${p.getVideoData().video_id}`);
    setTimeout(() => { p.playVideo(); log(`[${ts()}] ▶ Resume after large pause`); }, pauseLen);
  }, delayLarge);
}

function scheduleMidSeek(p) {
  const interval = rndInt(MID_SEEK_INTERVAL_MIN[0], MID_SEEK_INTERVAL_MIN[1]) * 60000;
  setTimeout(() => {
    const seek = rndInt(MID_SEEK_WINDOW_S[0], MID_SEEK_WINDOW_S[1]);
    p.seekTo(seek, true);
    log(`[${ts()}] ⤴ Mid-seek to ${seek}s: id=${p.getVideoData().video_id}`);
    scheduleMidSeek(p);
  }, interval);
}

// --- Controls
function playAll() { players.forEach(p => p.playVideo()); log(`[${ts()}] ▶ Play All`); }
function pauseAll() { players.forEach(p => p.pauseVideo()); stats.pauses++; log(`[${ts()}] ⏸ Pause All`); }
function stopAll() { players.forEach(p => p.stopVideo()); log(`[${ts()}] ⏹ Stop All`); }

function nextAll() {
  players.forEach(p => { const newId = getRandomVideos(1)[0]; p.loadVideoById(newId); p.playVideo(); });
  stats.manualNext++; log(`[${ts()}] ⏭ Next All`);
}

function shuffleAll() {
  const sh = getRandomVideos(players.length);
  players.forEach((p, i) => { p.loadVideoById(sh[i]); p.playVideo(); });
  stats.shuffle++; log(`[${ts()}] 🎲 Shuffle All`);
}

function restartAll() {
  const set = getRandomVideos(players.length);
  players.forEach((p, i) => { p.stopVideo(); p.loadVideoById(set[i]); p.playVideo(); });
  stats.restart++; log(`[${ts()}] 🔁 Restart All`);
}

function toggleMuteAll() {
  if (isMutedAll) {
    players.forEach((p, i) => {
      p.unMute();
      const v = rndInt(UNMUTE_VOL_MIN, UNMUTE_VOL_MAX);
      p.setVolume(v);
      log(`[${ts()}] 🔊 Enable Sound + Unmute: Player${i + 1} -> ${v}%`);
    });
  } else {
    players.forEach((p, i) => { p.mute(); log(`[${ts()}] 🔇 Mute: Player${i + 1}`); });
  }
  isMutedAll = !isMutedAll;
}

function randomizeVolumeAll() {
  players.forEach((p, i) => { const v = rndInt(0, 100); p.setVolume(v); });
  stats.volumeChanges++; log(`[${ts()}] 🔊 Randomize Volume All`);
}

function normalizeVolumeAll() {
  players.forEach((p, i) => { p.setVolume(NORMALIZE_VOLUME_TARGET); });
  stats.volumeChanges++; log(`[${ts()}] 🎚 Normalize Volume All`);
}

function toggleTheme() {
  document.body.classList.toggle("light");
  log(`[${ts()}] 🌓 Theme toggled`);
}
