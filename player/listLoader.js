/* listLoader.js v1.1
 * Φόρτωση λίστας βίντεο με fallback (Local → Web → Internal)
 */

import { logInfo, logError } from "./utils.js";

const listLoader = {
  async loadVideoList() {
    try {
      // 1️⃣ Προσπάθεια: Local JSON (π.χ. videos.json)
      let localResp = await fetch("videos.json");
      if (localResp.ok) {
        let localData = await localResp.json();
        if (Array.isArray(localData) && localData.length > 0) {
          logInfo("Loaded video list from local JSON");
          return localData;
        }
      }
    } catch (err) {
      logError("Local list load failed: " + err);
    }

    try {
      // 2️⃣ Προσπάθεια: Web API (π.χ. GitHub raw ή άλλο endpoint)
      let webResp = await fetch("https://example.com/videos.json");
      if (webResp.ok) {
        let webData = await webResp.json();
        if (Array.isArray(webData) && webData.length > 0) {
          logInfo("Loaded video list from web API");
          return webData;
        }
      }
    } catch (err) {
      logError("Web list load failed: " + err);
    }

    // 3️⃣ Fallback: Internal hardcoded list
    logInfo("Using internal fallback video list");
    return [
  "ibfVWogZZhU","mYn9JUxxi0M","sWCTs_rQNy8","JFweOaiCoj4","U6VWEuOFRLQ",
  "ARn8J7N1hIQ","3nd2812IDA4","RFO0NWk-WPw","biwbtfnq9JI","3EXSD6DDCrU",
  "WezZYKX7AAY","AhRR2nQ71Eg","xIQBnFvFTfg","ZWbRPcCbZA8","YsdWYiPlEsE"
    ];
  }
};

export { listLoader };
