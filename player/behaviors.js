// behaviors.js
// Default random behaviors για τους players (fallback όταν δεν χρησιμοποιείται HumanBehaviorPro)

// --- Τυχαία pauses (μικρά & μεγάλα)
function scheduleRandomPauses(p, i) {
  playerTimers[i] = playerTimers[i] || [];

  // Μικρό pause
  const delaySmall = rndDelayMs(30, 120); // 0.5–2 λεπτά
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

  // Μεγάλο pause
  const delayLarge = rndDelayMs(120, 240); // 2–4 λεπτά
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

// --- Mid-seek (τυχαία μετακίνηση μέσα στο video)
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
