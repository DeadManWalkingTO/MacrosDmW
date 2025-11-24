# 🎬 Multi‑Viewer YouTube Player

Ένα web‑based multi‑viewer που εμφανίζει και διαχειρίζεται πολλαπλά YouTube βίντεο ταυτόχρονα, με φυσική συμπεριφορά και πλήρη έλεγχο μέσω UI.

---

## ✨ Χαρακτηριστικά

### 🎬 Διαχείριση Βίντεο
- 8 YouTube players σε grid (4×2 σε desktop, 2×4 σε mobile).
- Responsive layout με media queries για σωστή εμφάνιση σε μικρές οθόνες.
- Τυχαία καθυστέρηση εκκίνησης (5–180s) ώστε να μην ξεκινούν όλα μαζί.
- Τυχαίο αρχικό seek (0–60s) για διαφορετικό σημείο έναρξης.
- Auto‑next: όταν τελειώσει ένα βίντεο, φορτώνεται αυτόματα άλλο από τη λίστα.
- Mid‑seek: κάθε 5–9 λεπτά γίνεται τυχαία μετακίνηση σε νέο σημείο (30–120s).
- Τυχαίες παύσεις:
  - Μικρές (2–5s) μέσα στα πρώτα λεπτά.
  - Μεγάλες (15–30s) αργότερα.
- Playback quality ορίζεται σε “small” για σταθερή απόδοση.

### 🔊 Έλεγχος Ήχου
- **Mute/Unmute All**:  
  - Στο πρώτο click λειτουργεί ως Enable Sound, κάνει `unMute()` και δίνει τυχαία ένταση (10–30%).  
  - Στο επόμενο click ξανακάνει mute.  
- **Randomize Volume All**: τυχαία ένταση (0–100%) σε όλους τους players.  
- **Normalize Volume All**: επαναφορά έντασης σε σταθερή τιμή (20%).  

### 🖥️ Panel Ελέγχου
- Play All: ξεκινά όλα τα βίντεο.  
- Pause All: παύση όλων.  
- Stop All: σταματά όλα.  
- Next All: φορτώνει νέο βίντεο σε όλους.  
- Shuffle All: τυχαία κατανομή νέων βίντεο σε όλους.  
- Restart All: σταματά και ξαναφορτώνει νέα βίντεο.  
- Mute/Unmute All: toggle με τυχαία ένταση.  
- Randomize Volume All: τυχαία ένταση.  
- Normalize Volume All: σταθερή ένταση.  
- Dark/Light Mode Toggle: εναλλαγή εμφάνισης.  

### 📊 Activity & Stats Panel
- Activity panel: εμφανίζει σε πραγματικό χρόνο όλα τα logs (start, pause, resume, seek, volume changes, auto‑next).  
- Stats panel: μετρητές για:
  - AutoNext  
  - Manual Next  
  - Shuffle  
  - Restart  
  - Pauses  
  - Volume Changes  

### ⚙️ Τεχνικά Χαρακτηριστικά
- Σταθερή λίστα 15 YouTube IDs ενσωματωμένη στο `functions.js`.  
- Τυχαίες ενέργειες (seek, pause, volume) για πιο φυσική συμπεριφορά.  
- Logging με timestamps για κάθε ενέργεια.  
- Εμφάνιση logs και stats απευθείας στη σελίδα.  
- Responsive design με media queries.  
- Dark/Light mode με CSS.  

---

## 📂 Δομή Project
project/ 
├── index.html # Layout, κουμπιά, panels, σύνδεση με JS 
├── functions.js # Όλη η λογική του player 
└── README.md # Περιγραφή χαρακτηριστικών


---

## 🚀 Χρήση
1. Άνοιξε το `index.html` σε browser με σύνδεση στο Internet.  
2. Το YouTube IFrame API φορτώνεται αυτόματα.  
3. Οι players ξεκινούν με τυχαία καθυστέρηση και συμπεριφορά.  
4. Χρησιμοποίησε τα κουμπιά για να ελέγξεις όλους τους players.  

---

## 📌 Σημείωση
- Ο player χρησιμοποιεί **μόνο τα 15 IDs** που είναι ενσωματωμένα στο `functions.js`.  
- Δεν χρειάζεται εξωτερικό `list.txt`.  
- Μπορείς να αλλάξεις ή να προσθέσεις IDs απευθείας στο array `videoList`.  





