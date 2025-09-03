# 📝 Endoc Word Add-In – Developer Guide

This repository contains the Word add-in frontend.  
It runs locally during development with **webpack** on port `7000` and uses a secure **local HTTPS proxy** on port `3001` to forward API requests to the backend.

---

## ⚙️ Requirements

- Microsoft **Word** (desktop app installed)  
- **Node.js 18+** (v18 or higher, v20 also works)  
- npm v9+ (ships with Node)  
- Git  
- macOS or Windows (Linux is not supported for Word desktop add-ins)

---

## 🚀 Setup (First Time)

1. **Clone this repo**
   ```bash
   git clone https://github.com/science-editor/word-add-in.git
   cd word-add-in
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Office dev certificates** (only needed once per machine)
   ```bash
   npx office-addin-dev-certs install
   ```
   - On macOS: open **Keychain Access → Certificates → localhost**, set it to **Always Trust**.
   - On Windows: accept the certificate prompt.  
   ✅ Without this step, Word will reject `https://localhost` and the add-in won’t load.

4. **Run the local proxy** (separate repo)
   - Clone & run [word-add-in-proxy](https://github.com/science-editor/word-add-in-proxy):
     ```bash
     git clone https://github.com/science-editor/word-add-in-proxy.git
     cd word-add-in-proxy
     npm install
     node server.mjs
     ```
   - You should see:
     ```
     ✅ Secure Proxy running:
        UI origin      : https://localhost:7000
        Proxy endpoint : https://localhost:3001/proxy
        Target GraphQL : https://endoc.ethz.ch/graphql
     ```

5. **Start the dev server + sideload Word**
   From this repo’s root:
   ```bash
   npm start
   ```
   This will:
   - Start webpack on <https://localhost:7000>
   - Launch Word
   - Auto-sideload the add-in using `manifest.xml`

6. **Confirm it works**
   - Open <https://localhost:7000/taskpane.html> in your browser  
     → You should see the taskpane app (React UI).
   - Open Word: the add-in should appear in the taskpane.

---

## 🔑 API Key Setup

- Open the add-in pane in Word.  
- Paste your API key into the input field (stored in localStorage).  
- All queries will now go through the proxy → backend.

---

## 🛠️ Troubleshooting

### ❌ “Sorry we can’t load the add-in”
- Run:
  ```bash
  npm run stop
  npm start
  ```
- Then open: <https://localhost:7000/taskpane.html>  
  If this loads in browser but not in Word, **Word isn’t trusting the dev cert** → re-run:
  ```bash
  npx office-addin-dev-certs install
  ```

### ❌ `EADDRINUSE: address already in use`
- Something else is already running on port 7000 or 3001.  
- Kill existing processes:
  ```bash
  lsof -nP -iTCP:7000 -sTCP:LISTEN
  kill -9 <PID>
  lsof -nP -iTCP:3001 -sTCP:LISTEN
  kill -9 <PID>
  ```
- Restart `npm start`.

### ❌ Network errors in the add-in
- Check proxy logs (the `node server.mjs` terminal):  
  - You should see `➡️ POST /proxy` and `⬅️ 200 OK`.  
  - If it shows `500` or `502`, copy the logged response and investigate backend config.

### ❌ Debugging inside Word without Safari inspector
- Use **console logging** in your React code:
  ```ts
  console.info("[Endoc/Apollo]", { url: GRAPHQL_URL, operationName });
  ```
- Logs appear in the dev server terminal (if using HMR) or proxy terminal.

---

## 🌍 Production Build

To bundle for deployment:
```bash
npm run build
```

This generates a `/dist` folder.  
In production, the add-in is served at <https://endoc.ethz.ch/word-add-in/taskpane.html> via Nginx/Docker.  

The production manifest is [`manifest.prod.xml`](manifest.prod.xml).

---

## 🌐 Sideload in Office on the Web

1. Download [`manifest.prod.xml`](https://github.com/science-editor/word-add-in/blob/main/manifest.prod.xml)  
2. Open [Office on the web](https://m365.cloud.microsoft/) → Word document  
3. Go to **Home > … > Add-ins > Advanced… > Upload My Add-in**  
4. Select the manifest file  
5. The add-in loads in the taskpane

---

✨ You’re now ready to develop and test the Endoc Word Add-In locally.