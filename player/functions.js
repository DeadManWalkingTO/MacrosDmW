// ==========================
// YouTube API Initialization
// ==========================
let players = [];

function onYouTubeIframeAPIReady() {
  // Δημιουργία player1
  players.push(new YT.Player('player1', {
    events: {
      'onReady': onPlayerReady
    }
  }));

  // Δημιουργία player2
  players.push(new YT.Player('player2', {
    events: {
      'onReady': onPlayerReady
    }
  }));
}

function onPlayerReady(event) {
  const id = event.target.getIframe().id;
  logEvent(`Player ${id} → Ready`);
}

// ==========================
// Utility Functions
// ==========================
function logEvent(msg) {
  const logDiv = document.getElementById("log");
  const time = new Date().toLocaleTimeString();
  logDiv.innerHTML += `[${time}] ${msg}<br>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

// ==========================
// Realistic Mode Toggle
// ==========================
let realisticMode = false;

function toggleRealisticMode() {
  realisticMode = !realisticMode;
  logEvent(`Realistic Mode → ${realisticMode ? "ON" : "OFF"}`);
  if (realisticMode) {
    scheduleAutoNextAll(players);
    players.forEach(p => {
      scheduleQualityChange(p);
      simulateBuffer(p);
      scheduleDynamicVolume(p);
    });
  }
}

// ==========================
// Module A — Χρονισμός & Ρυθμοί
// ==========================

// Gaussian random generator
function gaussianRandom(mean, stdDev) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + stdDev * num;
}

// AutoNext σε όλους τους players
function scheduleAutoNextAll(players) {
  players.forEach(player => {
    let minutes = gaussianRandom(10, 2);
    if (minutes < 5) minutes = 5;
    if (minutes > 15) minutes = 15;
    const watchDuration = minutes * 60 * 1000;

    setTimeout(() => {
      player.nextVideo();
      logEvent(`Player ${player.id} → AutoNext after ${minutes.toFixed(1)} min`);
      if (realisticMode) scheduleAutoNextAll([player]); // επαναπρογραμματισμός
    }, watchDuration);
  });
}

// Program slots
let programSlots = [
  { start: 8, end: 11 },
  { start: 20, end: 23 }
];

function updateProgramSlots() {
  const morningStart = parseInt(document.getElementById("morningStart").value);
  const morningEnd   = parseInt(document.getElementById("morningEnd").value);
  const eveningStart = parseInt(document.getElementById("eveningStart").value);
  const eveningEnd   = parseInt(document.getElementById("eveningEnd").value);

  programSlots = [
    { start: morningStart, end: morningEnd },
    { start: eveningStart, end: eveningEnd }
  ];

  logEvent(`Program slots updated: Morning ${morningStart}-${morningEnd}, Evening ${eveningStart}-${eveningEnd}`);
}

function isProgramTime() {
  const now = new Date();
  const hour = now.getHours();
  return programSlots.some(slot => hour >= slot.start && hour < slot.end);
}

function startIfProgramTime(player) {
  if (isProgramTime()) {
    player.playVideo();
    logEvent(`Player ${player.id} → Started in program slot`);
  } else {
    logEvent(`Player ${player.id} → Waiting for program slot`);
  }
}

// Staggered actions
function staggeredAction(players, actionFn) {
  players.forEach(player => {
    const delay = (Math.random() * 1500) + 500;
    setTimeout(() => {
      actionFn(player);
      logEvent(`Player ${player.id} → Action after ${delay.toFixed(0)} ms`);
    }, delay);
  });
}

// ==========================
// Module B — Συμπεριφορά Εικόνας & Ήχου
// ==========================

// Fade in/out
function fadeIn(player) {
  let volume = 0;
  player.setVolume(volume);
  let opacity = 0;
  const iframe = document.getElementById(player.id);
  iframe.style.opacity = opacity;

  const fadeInterval = setInterval(() => {
    if (volume < 20) volume += 2;
    if (opacity < 1) opacity += 0.1;
    player.setVolume(volume);
    iframe.style.opacity = opacity;
    if (volume >= 20 && opacity >= 1) clearInterval(fadeInterval);
  }, 200);
}

function fadeOut(player) {
  let volume = player.getVolume();
  let opacity = 1;
  const iframe = document.getElementById(player.id);

  const fadeInterval = setInterval(() => {
    if (volume > 0) volume -= 2;
    if (opacity > 0) opacity -= 0.1;
    player.setVolume(volume);
    iframe.style.opacity = opacity;
    if (volume <= 0 && opacity <= 0) clearInterval(fadeInterval);
  }, 200);
}

// Quality change
function scheduleQualityChange(player) {
  const delay = (Math.floor(Math.random() * 6) + 15) * 60 * 1000;
  setTimeout(() => {
    const qualities = ["small", "medium", "large"];
    const q = qualities[Math.floor(Math.random() * qualities.length)];
    player.setPlaybackQuality(q);
    logEvent(`Player ${player.id} → Quality changed to ${q}`);
    if (realisticMode) scheduleQualityChange(player);
  }, delay);
}

// Buffer events
function simulateBuffer(player) {
  const delay = (Math.floor(Math.random() * 10) + 5) * 60 * 1000;
  setTimeout(() => {
    player.pauseVideo();
    logEvent(`Player ${player.id} → Buffering...`);
    setTimeout(() => {
      player.playVideo();
      logEvent(`Player ${player.id} → Resume after buffer`);
      if (realisticMode) simulateBuffer(player);
    }, 2000);
  }, delay);
}

// Dynamic volume
function scheduleDynamicVolume(player) {
  const delay = (Math.floor(Math.random() * 2) + 2) * 60 * 1000;
  setTimeout(() => {
    let current = player.getVolume();
    let change = (Math.random() * 10) - 5;
    let newVol = Math.max(0, Math.min(100, current + change));
    player.setVolume(newVol);
    logEvent(`Player ${player.id} → Volume adjusted to ${newVol}%`);
    if (realisticMode) scheduleDynamicVolume(player);
  }, delay);
}

// ==========================
// Module C — Αλληλεπίδραση Χρήστη
// ==========================

// Channel Surfing
let channelSurfing = false;
let channelSurfingTimers = [];

function toggleChannelSurfing() {
  channelSurfing = !channelSurfing;
  logEvent(`Channel Surfing → ${channelSurfing ? "ON" : "OFF"}`);

  if (channelSurfing) {
    startChannelSurfing(players);
  } else {
    stopChannelSurfing();
  }
}

function startChannelSurfing(players) {
  stopChannelSurfing();
  players.forEach(player => {
    const delay = (Math.floor(Math.random() * 61) + 30) * 1000;
    const timer = setTimeout(function surf() {
      player.nextVideo();
      logEvent(`Player ${player.id} → Channel Surfing (next video)`);
      const newDelay = (Math.floor(Math.random() * 61) + 30) * 1000;
      channelSurfingTimers[player.id] = setTimeout(surf, newDelay);
    }, delay);
    channelSurfingTimers[player.id] = timer;
  });
}

function stopChannelSurfing() {
  channelSurfingTimers.forEach(timer => clearTimeout(timer));
  channelSurfingTimers = [];
}

// PiP Overlay
let pipActive = false;
let pipPlayerId = null;

function togglePiP() {
  pipActive = !pipActive;
  logEvent(`Picture-in-Picture → ${pipActive ? "ON" : "OFF"}`);

  if (pipActive) {
    activatePiP(players[0]);
  } else {
    deactivatePiP();
  }
}

function activatePiP(player) {
  pipPlayerId = player.id;
  const iframe = document.getElementById(player.id);

  iframe.style.position = "fixed";
  iframe.style.width = "200px";
  iframe.style.height = "150px";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.zIndex = "9999";
  iframe.style.border = "2px solid #333";

  logEvent(`Player ${player.id} → PiP overlay activated`);
}

function deactivatePiP() {
  if (!pipPlayerId) return;
  const iframe = document.getElementById(pipPlayerId);

  iframe.style.position = "";
  iframe.style.width = "";
  iframe.style.height = "";
  iframe.style.bottom = "";
  iframe.style.right = "";
  iframe.style.zIndex = "";
  iframe.style.border = "";

  logEvent(`Player ${pipPlayerId} → PiP overlay deactivated`);
  pipPlayerId = null;
}
