# Build the RevPar Android APK (MVP)

This guide walks you from a clean Mac to an installed **debug APK** on a phone or emulator, plus the tiny realtime backend that powers cross-user "last-minute offer" notifications.

> **Notification reality check (MVP):** This MVP uses **Socket.IO + Capacitor LocalNotifications**, not FCM. You'll get real system-tray notifications when the app is **foreground or background**. They will NOT fire when the OS has fully killed the app — that case requires FCM (Phase 2).

---

## 0. Architecture in one picture

```
 Phone A (RevPar APK)                       Phone B (RevPar APK)
 ┌──────────────────────┐                   ┌──────────────────────┐
 │ React + Capacitor    │                   │ React + Capacitor    │
 │ WebView              │                   │ WebView              │
 │  ├ AppContext        │                   │  ├ AppContext        │
 │  ├ socketService ─┐  │                   │  ├ socketService ─┐  │
 │  └ notification ──┼──┼─────┐       ┌─────┼──┼─ notification    │
 └──────────────────────┘     │       │     └──────────────────────┘
                              ▼       ▼
                       ┌───────────────────┐
                       │ Node + Socket.IO  │
                       │ /server/index.js  │
                       │  port 4000        │
                       └───────────────────┘
```

When user A cancels:
1. `AppContext.cancelBooking()` creates the offer + emits `cancellation:created` to the server.
2. Server fans out `offer:new` to every other connected user.
3. Other phones receive it, merge into their `offers` state, and show a system notification (Android) or toast (web).

---

## 1. Prerequisites (install once)

You'll need three things on your Mac:

### 1a. Node.js 18+ (or 20 LTS)
The project's `package-lock.json` was generated with Node already in your environment. Easiest re-install:
```bash
# Option A: official installer
#   https://nodejs.org/  → download the LTS .pkg, run it
# Option B: nvm (recommended if you switch versions)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
exec zsh
nvm install --lts
node -v   # should print v20.x
npm -v
```

> If `npm install` fails with `SELF_SIGNED_CERT_IN_CHAIN`, follow `npm-ssl-fix-steps.txt` already in this repo (corporate Netskope CA).

### 1b. JDK 17 (required by Android Gradle Plugin 8.x)
```bash
# nvm-style: install via SDKMAN
curl -s "https://get.sdkman.io" | bash
exec zsh
sdk install java 17.0.11-tem
java -version    # should print "17.x"
# Make it permanent in your shell:
echo 'export JAVA_HOME="$(/usr/libexec/java_home -v 17)"' >> ~/.zshrc
```

Or just install Temurin 17 from <https://adoptium.net/>.

### 1c. Android Studio + SDK
1. Download from <https://developer.android.com/studio> and install.
2. First-run wizard: install **Android SDK Platform 34**, **Android SDK Build-Tools 34**, **Android SDK Platform-Tools**, and **Android Emulator**.
3. Add this to `~/.zshrc`:
   ```bash
   export ANDROID_HOME="$HOME/Library/Android/sdk"
   export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
   ```
4. Reload: `exec zsh`, then verify: `adb --version` and `sdkmanager --version`.

### 1d. (Optional) An Android emulator OR your phone
- **Emulator:** Android Studio → *Device Manager* → "+" → pick *Pixel 7* + system image *API 34* → Finish → ▶.
- **Real phone:** enable *Developer Options* + *USB debugging*, plug it in, accept the prompt.

Verify: `adb devices` shows your device/emulator.

---

## 2. Install dependencies

```bash
cd /Users/gagra697/Project/Projects/code-fest-rev-par

# Web app deps (new ones: @capacitor/*, socket.io-client)
npm install

# Backend deps (Express + Socket.IO)
npm run server:install
```

---

## 3. Run the realtime backend

Pick the LAN IP of your Mac so phones on the same Wi‑Fi can reach it:

```bash
ipconfig getifaddr en0     # e.g. 192.168.1.42
```

Start the server:
```bash
npm run server
# Listens on http://0.0.0.0:4000
# Health check: curl http://localhost:4000/health
```

Leave this terminal running.

---

## 4. Configure the app to talk to the backend

The app reads the backend URL from `src/config/appConfig.js` → `socketUrl`, overridable by `REACT_APP_SOCKET_URL` at build time.

Pick the right URL for your target:

| Target               | Use this URL                              |
|----------------------|-------------------------------------------|
| `npm start` in browser | `http://localhost:4000`                |
| Android **emulator**   | `http://10.0.2.2:4000` (the host loopback alias) |
| Android **physical phone** | `http://<your-mac-LAN-IP>:4000` (e.g. `http://192.168.1.42:4000`) |

For the most common case (real phone), create `.env.local`:
```bash
echo 'REACT_APP_SOCKET_URL=http://192.168.1.42:4000' > .env.local
```

---

## 5. Build the React bundle + sync to Android

First time only — scaffold the native Android project:
```bash
npm run build                      # outputs /build
npx cap add android                # creates /android folder
npx cap sync android               # copies /build into /android + plugins
```

After every web change, re-sync:
```bash
npm run build && npx cap sync android
```

Or use the shortcut script:
```bash
npm run cap:sync
```

---

## 6. Build the debug APK

### Option A: Android Studio (recommended first time)
```bash
npx cap open android
```
- Wait for Gradle sync to finish (first time ~5 min).
- *Build → Build Bundle(s)/APK(s) → Build APK(s)*.
- When done, click the "locate" link in the bottom-right toast.
- APK is at: `android/app/build/outputs/apk/debug/app-debug.apk`.

### Option B: Command line (faster once tooling works)
```bash
cd android
./gradlew assembleDebug
# APK at: android/app/build/outputs/apk/debug/app-debug.apk
cd ..
```

---

## 7. Install on your phone / emulator

```bash
# With phone or emulator connected:
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Or in Android Studio, just press ▶ with a device selected.

---

## 8. Test the cross-user notification flow

1. Start the backend: `npm run server` (terminal A).
2. Install the APK on **two devices** (or one device + one browser at `npm start`, both pointing to the same backend URL).
3. Log in as different users on each (e.g. Sarah on phone, Emma in browser).
4. On Sarah's phone: book a hotel, then cancel it.
5. Emma should immediately see:
   - A toast in the web build, OR
   - A system-tray notification on the phone.
6. The server log will show `broadcast offer OFF... -> delivered to N sockets`.

---

## 9. What changed in the repo (so you know what to review)

| File | Change |
|---|---|
| `src/App.jsx` | `BrowserRouter` → `HashRouter`; added `<Toaster />` |
| `package.json` | added `"homepage": "./"`, Capacitor + socket.io-client deps, helper scripts |
| `capacitor.config.json` | new — appId `com.revpar.booking`, name `RevPar`, webDir `build` |
| `src/config/appConfig.js` | new `socketUrl` field |
| `src/services/socketService.js` | new — Socket.IO client wrapper (no-op when offline) |
| `src/services/notificationService.js` | new — LocalNotifications on Android, toast on web |
| `src/context/AppContext.jsx` | connect socket on login, listen for `offer:new`, emit on cancel |
| `server/package.json` + `server/index.js` | new — Express + Socket.IO backend |

Files **not** touched: pages, hotel data, layout components, etc. The realtime layer is purely additive.

---

## 10. Troubleshooting

- **APK installs but white screen** → almost always means `BrowserRouter` is still in use somewhere or the `homepage` field is wrong. We've fixed both; if you re-fork, double-check.
- **Phone can't reach the backend** → confirm phone is on the same Wi-Fi as your Mac, the Mac firewall allows port 4000, and `REACT_APP_SOCKET_URL` uses the LAN IP, not `localhost`.
- **`cap sync` fails with "missing android platform"** → run `npx cap add android` first.
- **Gradle errors about Java version** → confirm `java -version` shows 17, and `JAVA_HOME` is set in the shell where you run Gradle / Android Studio.
- **Permission for notifications never asked** → Android 13+ requires explicit POST_NOTIFICATIONS permission. The plugin requests it on first `notify()`. If you denied it, toggle it back on in *Settings → Apps → RevPar → Notifications*.
- **Notifications work in foreground but not after backgrounding** → expected without FCM. The OS can suspend the WebView. Plan B is to add FCM later (Phase 2).

---

## 11. Phase-2 roadmap (when you outgrow MVP)

1. Add **FCM** via `@capacitor/push-notifications` for true push-when-killed.
2. Move state from in-memory Maps in `server/index.js` to a small DB (SQLite or Firestore).
3. Add user auth on the backend (JWT in the socket handshake `auth.token`).
4. Replace `src/services/api.js` mock with real REST endpoints.
5. Sign a **release APK** with a keystore for distribution.
