// listLoader.js
// Φορτώνει τη λίστα βίντεο με fallback: Local → Web → Internal

// Ενσωματωμένη λίστα (fallback)
function getInternalList() {
  return [
  "ibfVWogZZhU","mYn9JUxxi0M","sWCTs_rQNy8","JFweOaiCoj4","U6VWEuOFRLQ",
  "ARn8J7N1hIQ","3nd2812IDA4","RFO0NWk-WPw","biwbtfnq9JI","3EXSD6DDCrU",
  "WezZYKX7AAY","AhRR2nQ71Eg","xIQBnFvFTfg","ZWbRPcCbZA8","YsdWYiPlEsE"
  ];
}

// Κύρια συνάρτηση φόρτωσης
async function loadVideoList() {
  try {
    // Δοκιμή τοπικού list.txt
    const r = await fetch("./list.txt");
    if (!r.ok) throw new Error("local-not-found");
    const t = await r.text();
    const arr = t.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (arr.length) {
      window.listSource = "Local";
      return arr;
    }
    throw new Error("local-empty");
  } catch {
    try {
      // Δοκιμή web (GitHub Pages)
      const r = await fetch("https://deadmanwalkingto.github.io/MacrosDmW/player/list.txt");
      if (!r.ok) throw new Error("web-not-found");
      const t = await r.text();
      const arr = t.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      if (arr.length) {
        window.listSource = "Web";
        return arr;
      }
      throw new Error("web-empty");
    } catch {
      // Fallback σε internal list
      window.listSource = "Internal";
      return getInternalList();
    }
  }
}

// Επαναφόρτωση λίστας
function reloadList() {
  loadVideoList()
    .then(list => {
      window.videoList = list; // ενημερώνουμε το global state
      log(`[${ts()}] 🔄 List reloaded — Source: ${window.listSource} (Total IDs = ${window.videoList.length})`);
    })
    .catch(err => {
      log(`[${ts()}] ❌ Reload failed: ${err}`);
      window.videoList = getInternalList();
      window.listSource = "Internal";
    });
}
