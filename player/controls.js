// controls.js
// Συναρτήσεις για τα κουμπιά ελέγχου των players

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

    if (USE_HUMAN_BEHAVIOR_PRO && typeof scheduleHumanBehaviorPro === "function") {
      scheduleHumanBehaviorPro(p, i);
    } else {
      scheduleRandomPauses(p, i);
      scheduleMidSeek(p, i);
    }
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

    if (USE_HUMAN_BEHAVIOR_PRO && typeof scheduleHumanBehaviorPro === "function") {
      scheduleHumanBehaviorPro(p, i);
    } else {
      scheduleRandomPauses(p, i);
      scheduleMidSeek(p, i);
    }
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

    if (USE_HUMAN_BEHAVIOR_PRO && typeof scheduleHumanBehaviorPro === "function") {
      scheduleHumanBehaviorPro(p, i);
    } else {
      scheduleRandomPauses(p, i);
      scheduleMidSeek(p, i);
    }
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
