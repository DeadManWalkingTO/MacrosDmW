/* functions.js v1.1
 * Κεντρικός orchestrator: state, config, kickoff
 */

// Global state
let players = [];
let playerConfig = {
  count: 8,
  ids: ["player1","player2","player3","player4","player5","player6","player7","player8"],
  videoList: []
};

// Kickoff: όταν φορτώσει το API
function onYouTubeIframeAPIReady() {
  logInfo("YouTube API Ready. Initializing players...");
  initPlayers();
}

// Initialize all players
function initPlayers() {
  listLoader.loadVideoList()
    .then(list => {
      playerConfig.videoList = list;
      logInfo("Video list loaded, initializing players...");

      for (let i = 0; i < playerConfig.count; i++) {
        let playerId = playerConfig.ids[i];
        players[i] = new YT.Player(playerId, {
          height: "100%",
          width: "100%",
          videoId: playerConfig.videoList[i % playerConfig.videoList.length],
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }
    })
    .catch(err => {
      logError("Video list load failed: " + err);
    });
}

// Controls binding
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("playAll").addEventListener("click", () => controls.playAll(players));
  document.getElementById("pauseAll").addEventListener("click", () => controls.pauseAll(players));
  document.getElementById("restartAll").addEventListener("click", () => controls.restartAll(players));
  document.getElementById("shuffleAll").addEventListener("click", () => controls.shuffleAll(players, playerConfig.videoList));
  document.getElementById("muteAll").addEventListener("click", () => controls.muteAll(players));
});

// Export για άλλα modules
export { players, playerConfig };
