# Express Book Review — Final Project

A server-side Node.js/Express application for an online bookstore, implementing:
- Public endpoints to list books, and search by ISBN, author, or title
- Public endpoint to view reviews for a book
- User registration and session/JWT-based login
- Authenticated endpoints to add/update and delete a review

## 1. Project structure

```
expressBookReview/
├── index.js                 # App entry point, session + JWT middleware
├── package.json
└── router/
    ├── booksdb.js            # In-memory "database" of books
    ├── general.js             # Public routes + Axios promise/async-await client functions
    └── auth_users.js          # Registration, login, add/update/delete review
```

## 2. Setup

```bash
git clone https://github.com/<your-username>/expressBookReview.git
cd expressBookReview
npm install
npm start
```

The server runs on `http://localhost:5000`.

## 3. Task-by-task cURL commands

Run these from a terminal (a second terminal/tab, with the server running in the first).
Screenshot the command **and** its output for each task, and save the image with the
filename shown (no file extension needed, but keep it recognizable, e.g. `githubrepo.png`).

### Task 1 — `githubrepo`
Fork `ibm-developer-skills-network/expressBookReview` on GitHub first (via the GitHub UI),
then clone your fork and show it's tracked correctly:
```bash
git clone https://github.com/<your-username>/expressBookReview.git
cd expressBookReview
git remote -v
```

### Task 2 — `getallbooks`
```bash
curl -X GET http://localhost:5000/
```

### Task 3 — `getbooksbyISBN`
```bash
curl -X GET http://localhost:5000/isbn/1
```

### Task 4 — `getbooksbyauthor`
```bash
curl -X GET http://localhost:5000/author/Jane%20Austen
```

### Task 5 — `getbooksbytitle`
```bash
curl -X GET http://localhost:5000/title/Fairy%20tales
```

### Task 6 — `getbookreview`
```bash
curl -X GET http://localhost:5000/review/1
```

### Task 7 — `register`
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

### Task 8 — `login`
Use `-c cookies.txt` so the session cookie is saved for the review requests that follow.
```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}' \
  -c cookies.txt
```

### Task 9 — `reviewadded`
```bash
curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Amazing%20read!" \
  -b cookies.txt
```

### Task 10 — `deletereview`
```bash
curl -X DELETE http://localhost:5000/customer/auth/review/1 \
  -b cookies.txt
```

### Task 11 — `general.js`
Push your code to GitHub and submit the direct URL to the file, e.g.:
```
https://github.com/<your-username>/expressBookReview/blob/main/router/general.js
```

`router/general.js` already implements, as required:
- `getAllBooksAsync()` — async/await + Axios
- `getBookByISBNPromise(isbn)` — Promise-chain (`.then`/`.catch`) + Axios
- `getBooksByAuthorAsync(author)` — async/await + Axios
- `getBooksByTitleAsync(title)` — async/await + Axios

They're also wired up to optional `/async/...` routes (`/async/books`, `/async/isbn/:isbn`,
`/async/author/:author`, `/async/title/:title`) so you can exercise them directly with cURL
too, in addition to the plain synchronous routes (`/`, `/isbn/:isbn`, `/author/:author`,
`/title/:title`) used for Tasks 2–5.

## 4. Notes

- `users` and book `reviews` are stored in memory, so they reset whenever the server restarts.
- Change `SECRET_KEY` in `router/auth_users.js` and `index.js` if you want a different JWT secret
  (make sure both match).
- Remember to `git add . && git commit -m "final project" && git push` before submitting.
