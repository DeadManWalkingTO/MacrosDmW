// HumanBehaviorExtended.js
// Προσομοίωση πιο φυσικής συμπεριφοράς θέασης

function scheduleHumanBehaviorExtended(p, i) {
  playerTimers[i] = playerTimers[i] || [];

  // --- Τυχαίο pause (σαν χρήστης που αλλάζει tab)
  const pauseDelay = rndDelayMs(60, 600); // 1–10 λεπτά
  const pauseTimer = setTimeout(() => {
    const pauseLen = rndInt(5000, 20000); // 5–20s
    p.pauseVideo(); stats.pauses++;
    logPlayer(i, `⏸ Human pause ${Math.round(pauseLen/1000)}s`, p.getVideoData().video_id);

    if (Math.random() < 0.7) { // 70% πιθανότητα να ξαναπαίξει
      const resumeTimer = setTimeout(() => {
        p.playVideo();
        logPlayer(i, "▶ Resume", p.getVideoData().video_id);
      }, pauseLen);
      playerTimers[i].push(resumeTimer);
    }
    scheduleHumanBehaviorExtended(p, i);
  }, pauseDelay);
  playerTimers[i].push(pauseTimer);

  // --- Skip forward/backward
  const seekDelay = rndDelayMs(180, 900); // 3–15 λεπτά
  const seekTimer = setTimeout(() => {
    const offset = rndInt(-20, 30); // -20s έως +30s
    const newPos = Math.max(0, p.getCurrentTime() + offset);
    p.seekTo(newPos, true);
    logPlayer(i, `⤴ Human skip ${offset}s`, p.getVideoData().video_id);
    scheduleHumanBehaviorExtended(p, i);
  }, seekDelay);
  playerTimers[i].push(seekTimer);

  // --- Volume drift
  if (!isMutedAll && Math.random() < 0.5) {
    const volDelay = rndDelayMs(120, 480); // 2–8 λεπτά
    const volTimer = setTimeout(() => {
      const currentVol = p.getVolume();
      const drift = rndInt(-3, 3);
      const newVol = Math.min(100, Math.max(0, currentVol + drift));
      p.setVolume(newVol);
      stats.volumeChanges++;
      logPlayer(i, `🔊 Volume drift -> ${newVol}%`, p.getVideoData().video_id);
      scheduleHumanBehaviorExtended(p, i);
    }, volDelay);
    playerTimers[i].push(volTimer);
  }

  // --- Quality change
  if (Math.random() < 0.2) { // 20% πιθανότητα
    const qualityDelay = rndDelayMs(300, 900); // 5–15 λεπτά
    const qualityTimer = setTimeout(() => {
      const qualities = ['small','medium','hd720'];
      const q = qualities[rndInt(0, qualities.length-1)];
      p.setPlaybackQuality(q);
      logPlayer(i, `📺 Quality change -> ${q}`, p.getVideoData().video_id);
      scheduleHumanBehaviorExtended(p, i);
    }, qualityDelay);
    playerTimers[i].push(qualityTimer);
  }
}
