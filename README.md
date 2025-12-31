📚 MyWriter — Book Manager (Add + Edit + Delete + LocalStorage)
A simple book catalog app with strong Part-series validation

This app helps you store book titles locally (browser LocalStorage)
and ensures clean, consistent series titles like:

Rumi — Part I
Rumi — Part II
Rumi — Part III

No backend required — everything runs inside the browser.

✨ Features

✔ Add / Edit / Delete books
✔ Automatic LocalStorage save
✔ Search filter
✔ Roman-Part validation (I, II, III … only)
✔ Prevents duplicate titles
✔ Prevents mistakes like:

Rumi Part I
Rumi I
Rumi - 2
Rumi : III
Rumi — Part 1

🧠 Why so many validations?

Book series usually follow a pattern:

Title — Part I
Title — Part II
Title — Part III

If we allow users to mix formats like:

Rumi 1
Rumi Part 2
Rumi - II
Rumi II

➡ searching becomes messy
➡ sorting becomes impossible
➡ duplicates happen

So the validation gently pushes users into one clean standard format.

🏗 Architecture (simple overview)
src/
├─ context/
│ └─ BooksContext.jsx ← main logic (CRUD + validation + storage)
├─ utils/
│ └─ normalize.js ← title cleaning + comparison helpers
├─ components/
│ ├─ AddBookForm.jsx
│ ├─ BookList.jsx
│ └─ ToastContext.jsx ← shows validation messages
└─ App.js

🔍 Core validation rules
1️⃣ Title rules

❌ Not allowed:

Example Reason
Rumi 2 Looks like fake part
Rumi - 2 Wrong format
Rumi Part I Part belongs in Part box
Rumi I Fake part
Rumi — II Fake part
Rumi!! punctuation normalized

✔ Allowed:

Rumi
Rumi Poems
The Prophet

2️⃣ Part rules (Roman only)

Allowed:

I, II, III, IV, V, VI, VII, VIII, IX

Validation ensures:

Rule Example
Must start from Part I ❌ cannot add Part II first
Must be sequential ❌ cannot skip from I → III
No duplicate parts ❌ two Part II not allowed
No base after series started ❌ "Rumi" after Part I exists
💾 LocalStorage behavior

Data persists automatically.

Close tab → reopen → books still there.

If LocalStorage ever gets corrupted
(app handles it safely and resets to empty).

▶️ How to run (development)
npm install
npm start

Open:

http://localhost:3000

🧩 Helper utilities
normalizeForCompare()

Normalizes text so that the app can detect duplicates, even if
spacing/punctuation changes.

Example:

Input Normalized
Rumi — Poems!! rumi poems
Rumi_Poems rumi poems
🔮 Future ideas (roadmap)

⬜ Export / Import books (JSON)
⬜ Admin-only delete protection
⬜ Auto-reorder Part numbers after delete
⬜ Cloud sync option (later)

👩‍💻 Creator Notes

This project focuses on:

clean data entry discipline

reusable validation rules

real-world publishing workflow

It is a practical step toward a larger Book + Chapter + TTS platform.
