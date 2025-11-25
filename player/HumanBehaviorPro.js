// HumanBehaviorPro.js
// Συνδυασμός όλων των προτάσεων για πιο φυσική συμπεριφορά

function scheduleHumanBehaviorPro(p, i) {
  playerTimers[i] = playerTimers[i] || [];

  // --- Pause με πιθανότητα να μην ξαναπαίξει
  const pauseDelay = rndDelayMs(60, 600); // 1–10 λεπτά
  const pauseTimer = setTimeout(() => {
    const pauseLen = rndInt(5000, 20000); // 5–20s
    p.pauseVideo(); stats.pauses++;
    logPlayer(i, `⏸ Pause ${Math.round(pauseLen/1000)}s`, p.getVideoData().video_id);

    if (Math.random() < 0.7) { // 70% πιθανότητα να ξαναπαίξει
      const resumeTimer = setTimeout(() => {
        p.playVideo();
        logPlayer(i, "▶ Resume", p.getVideoData().video_id);
      }, pauseLen);
      playerTimers[i].push(resumeTimer);
    }
    scheduleHumanBehaviorPro(p, i);
  }, pauseDelay);
  playerTimers[i].push(pauseTimer);

  // --- Skip forward/backward με πιθανότητες
  const seekDelay = rndDelayMs(180, 900); // 3–15 λεπτά
  const seekTimer = setTimeout(() => {
    const chance = Math.random();
    let offset = 0;
    if (chance < 0.2) offset = -rndInt(5, 10); // rewind
    else if (chance < 0.6) offset = rndInt(10, 30); // skip forward
    else if (chance < 0.7) { // stop
      p.stopVideo();
      logPlayer(i, "⏹ User stopped", p.getVideoData().video_id);
      return;
    }
    const newPos = Math.max(0, p.getCurrentTime() + offset);
    p.seekTo(newPos, true);
    logPlayer(i, `⤴ Skip ${offset}s`, p.getVideoData().video_id);
    scheduleHumanBehaviorPro(p, i);
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
      scheduleHumanBehaviorPro(p, i);
    }, volDelay);
    playerTimers[i].push(volTimer);
  }

  // --- Quality change
  if (Math.random() < 0.2) {
    const qualityDelay = rndDelayMs(300, 900); // 5–15 λεπτά
    const qualityTimer = setTimeout(() => {
      const qualities = ['small','medium','hd720'];
      const q = qualities[rndInt(0, qualities.length-1)];
      p.setPlaybackQuality(q);
      logPlayer(i, `📺 Quality change -> ${q}`, p.getVideoData().video_id);
      scheduleHumanBehaviorPro(p, i);
    }, qualityDelay);
    playerTimers[i].push(qualityTimer);
  }

  // --- Tab switching simulation
  if (Math.random() < 0.3) { // 30% πιθανότητα
    const tabDelay = rndDelayMs(300, 900); // 5–15 λεπτά
    const tabTimer = setTimeout(() => {
      p.pauseVideo(); stats.pauses++;
      logPlayer(i, "⏸ Tab switch pause", p.getVideoData().video_id);
      const otherIndex = rndInt(0, players.length-1);
      if (players[otherIndex] && otherIndex !== i) {
        players[otherIndex].playVideo();
        logPlayer(otherIndex, "▶ Tab switch resume", players[otherIndex].getVideoData().video_id);
      }
      scheduleHumanBehaviorPro(p, i);
    }, tabDelay);
    playerTimers[i].push(tabTimer);
  }
}
