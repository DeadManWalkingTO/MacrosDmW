/* controls.js v1.1
 * Συναρτήσεις για κουμπιά (Play, Pause, Restart, Shuffle, Mute)
 */

import { logInfo, updateStats, getRandomElement } from "./utils.js";

// Play All
function playAll(players) {
  players.forEach(p => {
    if (p && p.playVideo) {
      p.playVideo();
    }
  });
  updateStats("plays");
  logInfo("Play All triggered");
}

// Pause All
function pauseAll(players) {
  players.forEach(p => {
    if (p && p.pauseVideo) {
      p.pauseVideo();
    }
  });
  updateStats("pauses");
  logInfo("Pause All triggered");
}

// Restart All
function restartAll(players) {
  players.forEach(p => {
    if (p && p.seekTo) {
      p.seekTo(0);
      p.playVideo();
    }
  });
  updateStats("restarts");
  logInfo("Restart All triggered");
}

// Shuffle All
function shuffleAll(players, videoList) {
  players.forEach(p => {
    if (p && p.loadVideoById) {
      let randomVideo = getRandomElement(videoList);
      if (randomVideo) {
        p.loadVideoById(randomVideo);
      }
    }
  });
  updateStats("shuffles");
  logInfo("Shuffle All triggered");
}

// Mute All
function muteAll(players) {
  players.forEach(p => {
    if (p && p.mute) {
      p.mute();
    }
  });
  updateStats("mutes");
  logInfo("Mute All triggered");
}

// Export
export { playAll, pauseAll, restartAll, shuffleAll, muteAll };
