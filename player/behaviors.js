/* behaviors.js v1.1
 * Default random behaviors (pauses, mid-seek)
 */

import { logInfo, getRandomInt } from "./utils.js";

// Εφαρμογή default behaviors σε έναν player
function applyDefaultBehaviors(player) {
  if (!player || !player.getPlayerState) return;

  // Τυχαία παύση μετά από 5–15 δευτερόλεπτα
  let pauseDelay = getRandomInt(5, 15) * 1000;
  setTimeout(() => {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
      logInfo("Default behavior: random pause applied");
    }
  }, pauseDelay);

  // Τυχαίο seek στη μέση του video μετά από 20–40 δευτερόλεπτα
  let seekDelay = getRandomInt(20, 40) * 1000;
  setTimeout(() => {
    if (player.getDuration && player.getPlayerState() === YT.PlayerState.PLAYING) {
      let midPoint = Math.floor(player.getDuration() / 2);
      player.seekTo(midPoint, true);
      logInfo("Default behavior: mid-seek applied at " + midPoint + "s");
    }
  }, seekDelay);
}

// Export
export { applyDefaultBehaviors };
