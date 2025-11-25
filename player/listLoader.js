// listLoader.js
// Φόρτωση λίστας βίντεο με fallback (Local → Web → Internal)

// --- Internal list (τελικό fallback)
const internalList = [
  "ibfVWogZZhU","mYn9JUxxi0M","sWCTs_rQNy8","JFweOaiCoj4","U6VWEuOFRLQ",
  "ARn8J7N1hIQ","3nd2812IDA4","RFO0NWk-WPw","biwbtfnq9JI","3EXSD6DDCrU",
  "WezZYKX7AAY","AhRR2nQ71Eg","xIQBnFvFTfg","ZWbRPcCbZA8","YsdWYiPlEsE"
];

let videoList = [];
let listSource = "Internal"; // Local | Web | Internal

// --- Φόρτωση λίστας με τριπλό fallback
function loadVideoList() {
  return fetch("list.txt")
    .then(r => r.ok ? r.text() : Promise.reject(new Error("local-not-found")))
    .then(text => {
      const arr = text.trim().split("\n").map(s => s.trim()).filter(Boolean);
      if (arr.length) { listSource = "Local"; return arr; }
      throw new Error("local-empty");
    })
    .catch(() => {
      return fetch("https://deadmanwalkingto.github.io/MacrosDmW/player/list.txt")
        .then(r => r.ok ? r.text() : Promise.reject(new Error("web-not-found")))
        .then(text => {
          const arr = text.trim().split("\n").map(s => s.trim()).filter(Boolean);
          if (arr.length) { listSource = "Web"; return arr; }
          throw new Error("web-empty");
        })
        .catch(() => { listSource = "Internal"; return internalList; });
    });
}

// --- Επαναφόρτωση λίστας
function reloadList() {
  loadVideoList().then(list => {
    videoList = list;
    log(`[${ts()}] 🔄 List reloaded — Source: ${listSource} (Total IDs = ${videoList.length})`);
  }).catch(err => {
    log(`[${ts()}] ❌ Reload failed: ${err}`);
  });
}
