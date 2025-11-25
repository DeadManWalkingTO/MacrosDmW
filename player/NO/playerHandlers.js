/* playerHandlers.js v1.1
 * YouTube API callbacks (onReady, onStateChange, initPlayers)
 */

import { logInfo, logError, updateStats } from "./utils.js";
import { players } from "./functions.js";
import { applyDefaultBehaviors } from "./behaviors.js";
import { applyHumanBehaviorPro } from "./HumanBehaviorPro.js";

// Callback όταν ο player είναι έτοιμος
function onPlayerReady(event) {
  logInfo("Player ready: " + event.target.getIframe().id);
  // Ξεκινάει να παίζει αμέσως
  event.target.playVideo();
}

// Callback όταν αλλάζει η κατάσταση του player
function onPlayerStateChange(event) {
  let state = event.data;
  let playerId = event.target.getIframe().id;

  switch (state) {
    case YT.PlayerState.PLAYING:
      logInfo("Player " + playerId + " is playing");
      updateStats("plays");
      // Εφαρμογή default behaviors
      applyDefaultBehaviors(event.target);
      // Εφαρμογή advanced behaviors
      applyHumanBehaviorPro(event.target);
      break;

    case YT.PlayerState.PAUSED:
      logInfo("Player " + playerId + " is paused");
      updateStats("pauses");
      break;

    case YT.PlayerState.ENDED:
      logInfo("Player " + playerId + " ended");
      updateStats("restarts");
      // Restart αυτόματα
      event.target.seekTo(0);
      event.target.playVideo();
      break;

    default:
      logError("Unhandled state for player " + playerId + ": " + state);
      break;
  }
}

// Export
export { onPlayerReady, onPlayerStateChange };
