// playerHandlers.js
// YouTube API callbacks και player management

// --- Καθαρισμός timers για συγκεκριμένο player
function clearPlayerTimers(i) {
  if (playerTimers[i]) {
    playerTimers[i].forEach(t => clearTimeout(t));
    playerTimers[i] = [];
  }
}

// --- YouTube API έτοιμο -> init players
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
      events: { 
        onReady: e => onPlayerReady(e, i), 
        onStateChange: e => onPlayerStateChange(e, i) 
      }
    });
  });

  log(`[${ts()}] ✅ Players initialized (${videoIds.length}) — Source: ${listSource} (Total IDs = ${videoList.length})`);
}

// --- Όταν ο player είναι έτοιμος
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

    if (USE_HUMAN_BEHAVIOR_PRO && typeof scheduleHumanBehaviorPro === "function") {
      scheduleHumanBehaviorPro(p, i);
    } else {
      scheduleRandomPauses(p, i);
      scheduleMidSeek(p, i);
    }
  }, startDelay);
}

// --- Όταν αλλάζει κατάσταση ο player
function onPlayerStateChange(e, i) {
  if (e.data === YT.PlayerState.ENDED) {
    clearPlayerTimers(i);
    const p = e.target;
    const newId = getRandomVideos(1)[0] || internalList[rndInt(0, internalList.length - 1)];
    p.loadVideoById(newId);
    stats.autoNext++;
    logPlayer(i, "⏭ AutoNext", newId);

    if (USE_HUMAN_BEHAVIOR_PRO && typeof scheduleHumanBehaviorPro === "function") {
      scheduleHumanBehaviorPro(p, i);
    } else {
      scheduleRandomPauses(p, i);
      scheduleMidSeek(p, i);
    }
  }
}
