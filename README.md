# FlowPay

Wallet app like Paytm. Users add money from their bank, set a pay limit, pay people or merchants and split bills. Interest is given only on the pay limit amount.

Three programs run together:

| Program | Folder | Port | Job |
|---|---|---|---|
| Client (React) | `client` | 3000 | the website |
| FlowPay server (Node + Express) | `server` | 3001 | wallet logic, REST APIs |
| FlowBank server (Node + Express) | `bank` | 3002 | separate bank with its own database |

## Evaluation checklist (where to show each point)

| Point | Where it is in the project |
|---|---|
| Front-End Document Structure (HTML) | `client/index.html` has doctype, `lang`, charset, viewport and title. The pages use semantic tags: `header`, `nav`, `main`, `section`, `footer`, `form`, `label`, `table` with `thead` and `tbody`, headings `h1` to `h3`. |
| Responsive Application (CSS and Tailwind) | Core CSS in `client/src/index.css` (about 40 lines): viewport meta tag, flexbox in the header and nav, CSS grid with `repeat(auto-fit, minmax(300px, 1fr))` for cards, and one `@media (max-width: 700px)` block. Tailwind CSS is used in one part: `components/QuickPay.jsx` (classes like `flex flex-wrap gap-3 rounded-2xl border-dashed`). |
| Front-end rendering (React JS) | `useState`, `useEffect`, `map()` for lists, conditional rendering (`&&`, `? :`), props, React Router, `fetch` for APIs. |
| Back End (Node JS and Express JS) | `server/` and `bank/`. Routes, middleware (`auth`, `admin`), JWT, bcrypt, REST APIs, JSON. |
| Database connection (MySQL) | `mysql2` in `db.js` of both servers. Databases `flowpay` (users, transactions, splits, company) and `flowbank` (accounts, bank_transactions). |
| Browser APIs | Geolocation API in `components/Location.jsx` (Home page). Drag and Drop API in `components/QuickPay.jsx` (Pay page): drag a coin of 20, 50, 100, 500 or 1000 and drop it to pay. |
| Project novelty | 1) Interest is paid only on the pay limit, but all the money is invested. 2) Dynamic interest rate that grows with the pool. 3) A separate bank server called through its own API. 4) Split bill with requests. |
| GitHub | See the GitHub section below. |
| Public link | Add your deployed link here: ____________ |

## How to run

1. Create both databases (in the flowpay folder)
   ```
   mysql -u root < database.sql
   mysql -u root < bank/bank.sql
   ```
   (add `-p` if root has a password and put that password in `DB_PASSWORD` of `server/.env` and `bank/.env`)
2. Terminal 1: `cd bank`, `npm install`, `npm start`
3. Terminal 2: `cd server`, `npm install`, `npm start`
4. Terminal 3: `cd client`, `npm install`, `npm run dev`
5. Open http://localhost:3000 . The bank page is http://localhost:3002

Admin login: `admin@flowpay.com` / `admin123`

Demo bank accounts: `1001` PIN `1111`, `1002` PIN `2222`, `1003` PIN `3333` (each has 50000).

## Folder structure

```
database.sql          flowpay tables + admin
bank/
  bank.sql            flowbank tables + accounts
  server.js  db.js
  routes/bank.js      accounts, transactions, transfer
  public/index.html   page that shows bank accounts live
server/
  server.js           starts express and links routes
  db.js               mysql connection
  middleware.js       auth (JWT check) and admin (role check)
  rate.js             dynamic interest rate
  bank.js             calls the bank API
  send.js             move money from one user to another
  routes/auth.js      register, login
  routes/wallet.js    me, add, limit, send, pay, history
  routes/splits.js    create split, list, pay split
  routes/admin.js     stats, add to master wallet, give interest
client/
  index.html
  src/main.jsx        starts React
  src/App.jsx         routes by role (not logged in, user, admin)
  src/api.js          fetch helper
  src/index.css       core styling + 3 lines that load Tailwind
  src/components/Navbar.jsx
  src/components/Location.jsx   Geolocation API (core CSS)
  src/components/QuickPay.jsx   Drag and Drop API (Tailwind CSS)
  src/pages/          Login Register Home Pay Split History Admin
```

## How to remember the code (3 patterns)

**Pattern 1: every server route**
```
router.post('/something', async (req, res) => {
  try {
    read req.body
    check the input
    run db.query(...)
    res.json({ message: '...' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})
```

**Pattern 2: every React page**
```
const [data, setData] = useState(...)       data from the server
const [msg, setMsg] = useState('')          message to show
useEffect(() => { load() }, [])             load once when page opens
async function submit(e) {                  on form submit
  e.preventDefault()
  try { await api(...); setMsg(...); load() } catch (err) { setMsg(err.message) }
}
return ( <section> <form onSubmit={submit}> <label>..<input/></label> <button/> </form> </section> )
```

**Pattern 3: every money rule**
- Add money: bank to master account, then balance and pool go up.
- Pay limit is always less than or equal to balance. Only the pay limit can be spent.
- Pay: balance and pay limit go down. Merchant: pool goes down too. User to user: pool same.
- Interest = pay limit x rate / 100 / 12. Rate = 3 + pool/100000, maximum 8.

## API list

FlowPay server (3001)

| Method | URL | Who | Use |
|---|---|---|---|
| POST | /api/auth/register | all | create account |
| POST | /api/auth/login | all | get token |
| GET | /api/wallet/me | user | balance, limit, rate |
| POST | /api/wallet/add | user | add money from bank |
| POST | /api/wallet/limit | user | set pay limit |
| POST | /api/wallet/send | user | send to user by email |
| POST | /api/wallet/pay | user | pay merchant |
| GET | /api/wallet/history | user | transactions |
| POST | /api/splits | user | create split |
| GET | /api/splits | user | my splits |
| POST | /api/splits/:id/pay | user | pay a split |
| GET | /api/admin/stats | admin | pool, rate, users |
| POST | /api/admin/master | admin | add money to master wallet |
| POST | /api/admin/interest | admin | give interest |

FlowBank server (3002): `GET /api/accounts`, `GET /api/transactions`, `POST /api/transfer` (from, pin, to, amount).

## Geolocation, Drag and Drop and Tailwind

- **Geolocation API:** `navigator.geolocation.getCurrentPosition(success, error)`. The browser asks for permission, then gives `pos.coords.latitude` and `pos.coords.longitude`. It works on `localhost` and on `https` sites only.
- **Drag and Drop API (HTML5):** the coin has `draggable` and `onDragStart`, where `e.dataTransfer.setData('text', coin)` stores the amount. The drop box has `onDragOver` (calls `e.preventDefault()` so dropping is allowed) and `onDrop` (reads `e.dataTransfer.getData('text')` and calls the pay API). It works with a mouse on a laptop or desktop, but not by touch on most phones.
- **Tailwind CSS:** installed with `tailwindcss` and `@tailwindcss/vite` (plugin in `vite.config.js`). Tailwind gives small utility classes, for example `flex`, `gap-3`, `rounded-2xl`, `bg-yellow-400`, written directly in `className`. The first 3 lines of `index.css` load only the Tailwind theme and utilities, and skip its global reset, so the rest of the app keeps its core CSS.

## Viva questions

- Why is the bank separate? A real app never touches a bank's database. It calls the bank API. Two servers and two databases talk over HTTP with JSON.
- What if the bank is down? `fetch` fails, we catch it and send "bank server is not running". FlowPay data is not changed.
- Why bcrypt? Passwords and PINs are never saved as plain text. `bcrypt.compare` checks them.
- What is JWT? A token given after login. The client sends it in the `authorization` header. The `auth` middleware checks it and puts the id and role in `req.user`.
- How is role based access done? Server: `admin` middleware checks `req.user.role`. Client: `App.jsx` shows different routes for not logged in, user and admin.
- Why `?` in queries? Prepared statements, they stop SQL injection.
- Why `async` and `await`? Database and network calls take time. We wait for them without blocking the server.
- `useState` and `useEffect`? State stores data and form values, and the page re-renders when it changes. `useEffect` with `[]` runs once when the page opens, to load data.
- What is CORS? The client (3000), the server (3001) and the bank (3002) are different origins. `cors()` allows the browser to call them.
- Is it responsive? Yes. Viewport meta tag, flexbox with `flex-wrap`, grid with `auto-fit`, and a media query for small screens.
- Core CSS and Tailwind together? Core CSS styles the whole app. Tailwind utility classes style only the Quick Pay card. Both are loaded by Vite into one stylesheet.
- Why `e.preventDefault()` in `onDragOver`? By default the browser does not allow dropping on an element. Preventing the default makes it a valid drop target.
- Why does Geolocation need permission? It shows the user's private location, so the browser always asks first. If the user denies it, the error callback runs.
- What would you improve? Use database transactions (`beginTransaction`, `commit`, `rollback`) so that a failure in the middle of a payment cannot leave money half moved. Also add login rate limiting and HTTPS.

## GitHub

```
cd flowpay
git init
git add .
git commit -m "FlowPay full stack project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/flowpay.git
git push -u origin main
```

`.gitignore` already keeps `node_modules` and `.env` out. Each folder has a `.env.example` so others can see which settings are needed.

## Deployment notes (for the public link)

- Client: set `VITE_API_URL` to the public address of the FlowPay server, ending with `/api`. Then run `npm run build` and host the `dist` folder.
- FlowPay server: set the same settings as `server/.env.example` on the host. `BANK_URL` must be the public address of the bank server.
- Bank server: set the settings from `bank/.env.example` on the host.
- Both servers need a MySQL database online. Run `database.sql` and `bank/bank.sql` on it. Change `SECRET` to a long random value.
