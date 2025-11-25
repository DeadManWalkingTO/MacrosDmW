// HumanBehavior.js
// Προσομοίωση πιο φυσικής συμπεριφοράς θέασης

function scheduleHumanBehavior(p, i) {
  playerTimers[i] = playerTimers[i] || [];

  // --- Τυχαίο pause (σαν χρήστης που αλλάζει tab)
  const pauseDelay = rndDelayMs(60, 300); // 1–5 λεπτά
  const pauseTimer = setTimeout(() => {
    const pauseLen = rndInt(3000, 12000); // 3–12s
    if (Math.random() < 0.25) { // 25% πιθανότητα να μην ξαναπαίξει
      p.pauseVideo();
      stats.pauses++;
      logPlayer(i, `⏸ Pause (user left)`, p.getVideoData().video_id);
    } else {
      p.pauseVideo();
      stats.pauses++;
      logPlayer(i, `⏸ Pause ${Math.round(pauseLen/1000)}s`, p.getVideoData().video_id);
      const resumeTimer = setTimeout(() => {
        p.playVideo();
        logPlayer(i, "▶ Resume", p.getVideoData().video_id);
      }, pauseLen);
      playerTimers[i].push(resumeTimer);
    }
    scheduleHumanBehavior(p, i); // recursive για επόμενη φορά
  }, pauseDelay);
  playerTimers[i].push(pauseTimer);

  // --- Skip forward ή rewind
  const seekDelay = rndDelayMs(120, 600); // κάθε 2–10 λεπτά
  const seekTimer = setTimeout(() => {
    const direction = Math.random() < 0.5 ? 1 : -1;
    const offset = rndInt(5, 20) * direction; // ±5–20s
    const current = p.getCurrentTime();
    const newPos = Math.max(0, current + offset);
    p.seekTo(newPos, true);
    logPlayer(i, `⤴ Human seek ${direction>0?'+':'-'}${Math.abs(offset)}s`, p.getVideoData().video_id);
    scheduleHumanBehavior(p, i); // επαναδρομή
  }, seekDelay);
  playerTimers[i].push(seekTimer);

  // --- Μικρές αλλαγές volume
  if (!isMutedAll && Math.random() < 0.4) { // 40% πιθανότητα
    const volDelay = rndDelayMs(90, 240); // κάθε 1.5–4 λεπτά
    const volTimer = setTimeout(() => {
      const currentVol = p.getVolume();
      const newVol = Math.min(100, Math.max(0, currentVol + rndInt(-5, 5)));
      p.setVolume(newVol);
      stats.volumeChanges++;
      logPlayer(i, `🔊 Human volume adjust -> ${newVol}%`, p.getVideoData().video_id);
      scheduleHumanBehavior(p, i);
    }, volDelay);
    playerTimers[i].push(volTimer);
  }
}
