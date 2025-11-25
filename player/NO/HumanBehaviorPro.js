/* HumanBehaviorPro.js v1.1
 * Προηγμένη προσομοίωση συμπεριφοράς (extended pauses, skips, drift, quality changes, tab switching)
 */

import { logInfo, getRandomInt } from "./utils.js";

// Εφαρμογή advanced behaviors σε έναν player
function applyHumanBehaviorPro(player) {
  if (!player || !player.getPlayerState) return;

  // Extended pause: τυχαία παύση 30–90 δευτερόλεπτα
  let extendedPauseDelay = getRandomInt(30, 90) * 1000;
  setTimeout(() => {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
      logInfo("HumanBehaviorPro: extended pause applied");
    }
  }, extendedPauseDelay);

  // Skip forward/backward: τυχαίο seek ±10–30 δευτερόλεπτα
  let skipDelay = getRandomInt(60, 120) * 1000;
  setTimeout(() => {
    if (player.getDuration && player.getPlayerState() === YT.PlayerState.PLAYING) {
      let currentTime = player.getCurrentTime();
      let skipOffset = getRandomInt(-30, 30);
      let newTime = Math.max(0, Math.min(player.getDuration(), currentTime + skipOffset));
      player.seekTo(newTime, true);
      logInfo("HumanBehaviorPro: skip applied, offset " + skipOffset + "s");
    }
  }, skipDelay);

  // Drift: μικρή τυχαία μετατόπιση χρόνου ±2–5 δευτερόλεπτα
  let driftDelay = getRandomInt(90, 150) * 1000;
  setTimeout(() => {
    if (player.getDuration && player.getPlayerState() === YT.PlayerState.PLAYING) {
      let currentTime = player.getCurrentTime();
      let driftOffset = getRandomInt(-5, 5);
      let newTime = Math.max(0, Math.min(player.getDuration(), currentTime + driftOffset));
      player.seekTo(newTime, true);
      logInfo("HumanBehaviorPro: drift applied, offset " + driftOffset + "s");
    }
  }, driftDelay);

  // Quality change: τυχαία αλλαγή ποιότητας (αν υποστηρίζεται)
  let qualityOptions = ["small", "medium", "large", "hd720", "hd1080"];
  let qualityDelay = getRandomInt(120, 180) * 1000;
  setTimeout(() => {
    if (player.setPlaybackQuality) {
      let randomQuality = qualityOptions[getRandomInt(0, qualityOptions.length - 1)];
      player.setPlaybackQuality(randomQuality);
      logInfo("HumanBehaviorPro: quality changed to " + randomQuality);
    }
  }, qualityDelay);

  // Tab switching simulation: pause/resume μετά από 2–5 λεπτά
  let tabSwitchDelay = getRandomInt(120, 300) * 1000;
  setTimeout(() => {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
      logInfo("HumanBehaviorPro: simulated tab switch (pause)");
      setTimeout(() => {
        player.playVideo();
        logInfo("HumanBehaviorPro: simulated tab switch (resume)");
      }, getRandomInt(10, 30) * 1000);
    }
  }, tabSwitchDelay);
}

// Export
export { applyHumanBehaviorPro };
