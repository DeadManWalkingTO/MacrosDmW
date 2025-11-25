# 🎬 YouTube Multi-Viewer

Ένα εργαλείο για την ταυτόχρονη προβολή πολλαπλών YouTube players με ρεαλιστική προσομοίωση συμπεριφοράς χρήστη.

---

## 📂 Modular Αρχιτεκτονική

Το project έχει διαχωριστεί σε modules για καλύτερη διαχείριση:

- **utils.js** → Βοηθητικές συναρτήσεις (logging, randomization, στατιστικά)
- **controls.js** → Συναρτήσεις για κουμπιά (Play, Pause, Restart, Shuffle, Mute κ.λπ.)
- **listLoader.js** → Φόρτωση λίστας βίντεο με fallback (Local → Web → Internal)
- **playerHandlers.js** → YouTube API callbacks (onReady, onStateChange, initPlayers)
- **behaviors.js** → Default random behaviors (pauses, mid-seek)
- **HumanBehaviorPro.js** → Προηγμένη προσομοίωση συμπεριφοράς (extended pauses, skips, drift, quality changes, tab switching)
- **functions.js** → Main orchestrator (state, config, kickoff)

---

## 📂 Video List Fallback Flow

Η εφαρμογή φορτώνει τη λίστα βίντεο με τριπλό fallback:

```mermaid
flowchart TD
    A[App starts] --> B{Local list.txt exists?}
    B -- Yes --> C[Load from Local list.txt]
    B -- No --> D{Web list available?}
    D -- Yes --> E[Load from Web list.txt (GitHub)]
    D -- No --> F[Use Internal list (embedded)]
    C --> G[videoList ready]
    E --> G[videoList ready]
    F --> G[videoList ready]
    G --> H[Init Players]
```
- **Local**: Αν υπάρχει `list.txt` στο ίδιο directory, φορτώνεται αυτό.  
- **Web**: Αν δεν υπάρχει τοπικό, γίνεται προσπάθεια φόρτωσης από GitHub.  
- **Internal**: Αν αποτύχουν και τα δύο, χρησιμοποιείται η ενσωματωμένη λίστα.  

---

## 🎭 HumanBehaviorPro.js

Το module **HumanBehaviorPro.js** προσθέτει πιο φυσική συμπεριφορά στους players:

- Extended pauses με πιθανότητα να μην ξαναπαίξει
- Skip forward/backward με πιθανότητες
- Volume drift (μικρές αυξομειώσεις)
- Quality changes (small, medium, hd720)
- Tab switching simulation (ένας player κάνει pause, άλλος ξεκινάει)
- Long idle states
- Probabilistic events (π.χ. rewind, skip forward, stop)

---

## ⚙️ Χρήση

1. Άνοιξε το `index.html` που φορτώνει όλα τα modules με τη σωστή σειρά.
2. Ρύθμισε το flag στο `functions.js`:

```js
const USE_HUMAN_BEHAVIOR_PRO = true;
```

3. Οι players θα χρησιμοποιούν το `scheduleHumanBehaviorPro()` αντί για τα default random behaviors.

---

## 📊 Stats & Logs

- Το panel `statsPanel` δείχνει counters (AutoNext, ManualNext, Shuffle, Restart, Pauses, VolumeChanges).
- Το panel `activityPanel` καταγράφει όλες τις ενέργειες με timestamp.

---

## 🌓 Theme

Υποστηρίζεται εναλλαγή dark/light theme με το κουμπί **🌓 Theme**.

---

## 🧹 Logs

Τα logs μπορούν να καθαριστούν με το κουμπί **🧹 Clear Logs**.
