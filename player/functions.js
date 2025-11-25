// functions.js
// Κεντρικό orchestrator που συνδέει όλα τα modules

// --- Versions
const JS_VERSION = "v2.0.0";
const HTML_VERSION = document.querySelector('meta[name="html-version"]')?.content || "unknown";

// --- Behavior toggle
const USE_HUMAN_BEHAVIOR_PRO = true; // true = HumanBehaviorPro.js, false = RandomBehavior

// --- State
let players = [];
let playerTimers = {}; // timers ανά player index
let videoList = [];
let isMutedAll = true;
let listSource = "Internal"; // Local | Web | Internal
const stats = { autoNext:0, manualNext:0, shuffle:0, restart:0, pauses:0, volumeChanges:0 };

// --- Log settings
const MAX_LOGS = 50;

// --- Config
const START_DELAY_MIN_S = 5, START_DELAY_MAX_S = 180;
const INIT_SEEK_MAX_S = 60;
const UNMUTE_VOL_MIN = 10, UNMUTE_VOL_MAX = 30;
const NORMALIZE_VOLUME_TARGET = 20;
const PAUSE_SMALL_MS = [2000, 5000];
const PAUSE_LARGE_MS = [15000, 30000];
const MID_SEEK_INTERVAL_MIN = [5, 9]; // minutes
const MID_SEEK_WINDOW_S = [30, 120];  // seconds

// --- Kick off project
loadVideoList()
  .then(list => {
    videoList = list;
    log(`[${ts()}] 🚀 Project start — HTML ${HTML_VERSION} | JS ${JS_VERSION}`);
    if (typeof YT !== "undefined" && YT.Player) initPlayers(getRandomVideos(8));
  })
  .catch(err => log(`[${ts()}] ❌ List load error: ${err}`));
