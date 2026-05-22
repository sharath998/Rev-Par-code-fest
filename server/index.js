/**
 * RevPar realtime backend (MVP)
 * ---------------------------------------------------------------
 * Purpose:
 *   When a user cancels a booking, the client emits `cancellation:created`
 *   to this server. The server records the offer and broadcasts
 *   `offer:new` to every other connected user, so their app can show
 *   a local system notification + in-app banner.
 *
 *   This is an MVP replacement for true push (FCM). It works while the
 *   app is in foreground or background, but NOT when the OS has fully
 *   killed the app.
 *
 * Run:
 *   cd server && npm install && npm start
 *   # listens on http://0.0.0.0:4000
 *
 * Env:
 *   PORT             - default 4000
 *   CORS_ORIGIN      - default "*"
 */

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { Server } = require('socket.io');

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
// Path to the React production build. By default we look one level up
// (so the same machine serves both the static React app AND the API).
const STATIC_DIR = process.env.STATIC_DIR || path.resolve(__dirname, '..', 'build');

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '256kb' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, methods: ['GET', 'POST'] },
});

// ---------------------------------------------------------------
// In-memory state (good enough for MVP; restart = clean slate)
// ---------------------------------------------------------------

/** Map<userId, Set<socketId>> */
const userSockets = new Map();
/** offers keyed by id, value = full offer payload */
const offers = new Map();

function addUserSocket(userId, socketId) {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId).add(socketId);
}
function removeSocket(socketId) {
  for (const [userId, set] of userSockets.entries()) {
    if (set.delete(socketId) && set.size === 0) userSockets.delete(userId);
  }
}
function logState(tag) {
  const connected = Array.from(userSockets.entries()).map(
    ([uid, set]) => `${uid}(${set.size})`
  );
  console.log(`[${new Date().toISOString()}] ${tag}  users=[${connected.join(', ')}]  offers=${offers.size}`);
}

// ---------------------------------------------------------------
// Plain HTTP endpoints (handy for debugging / fallback polling)
// ---------------------------------------------------------------

app.get('/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime(), users: userSockets.size, offers: offers.size });
});

app.get('/offers', (_req, res) => {
  res.json({ offers: Array.from(offers.values()) });
});

app.get('/offers/:userId', (req, res) => {
  const uid = req.params.userId;
  const list = Array.from(offers.values()).filter(
    (o) => Array.isArray(o.notifiedUserIds) && o.notifiedUserIds.map(String).includes(String(uid))
  );
  res.json({ offers: list });
});

// HTTP fallback in case Socket.IO isn't connected on a particular client
app.post('/cancellations', (req, res) => {
  const offer = req.body && req.body.offer;
  const cancellerId = req.body && req.body.cancellerId;
  if (!offer || !offer.id) return res.status(400).json({ error: 'offer.id required' });
  offers.set(offer.id, offer);
  broadcastNewOffer(offer, cancellerId);
  res.json({ ok: true, offerId: offer.id });
});

// ---------------------------------------------------------------
// Socket.IO wire protocol
// ---------------------------------------------------------------
// Client -> Server
//   identify             { userId }
//   cancellation:created { offer, cancellerId }
// Server -> Client
//   offer:new            offer            (broadcast to other users)
//   offer:ack            { offerId }      (echo back to canceller)
//   sync:offers          { offers: [...] }(on identify, send all relevant offers)
// ---------------------------------------------------------------

function broadcastNewOffer(offer, cancellerId) {
  const targets = Array.isArray(offer.notifiedUserIds) ? offer.notifiedUserIds : [];
  let delivered = 0;
  for (const uid of targets) {
    if (String(uid) === String(cancellerId)) continue;
    const socketIds = userSockets.get(uid) || userSockets.get(String(uid));
    if (!socketIds) continue;
    for (const sid of socketIds) {
      io.to(sid).emit('offer:new', offer);
      delivered += 1;
    }
  }
  console.log(`broadcast offer ${offer.id} -> delivered to ${delivered} sockets (targets=${targets.length})`);
}

io.on('connection', (socket) => {
  console.log(`+ socket connected ${socket.id}`);

  socket.on('identify', (payload) => {
    const userId = payload && payload.userId;
    if (!userId) return;
    socket.data.userId = userId;
    addUserSocket(userId, socket.id);
    // Sync any offers this user should already know about
    const list = Array.from(offers.values()).filter(
      (o) =>
        Array.isArray(o.notifiedUserIds) &&
        o.notifiedUserIds.map(String).includes(String(userId)) &&
        o.status === 'active'
    );
    socket.emit('sync:offers', { offers: list });
    logState(`identify ${userId}`);
  });

  socket.on('cancellation:created', (payload) => {
    const { offer, cancellerId } = payload || {};
    if (!offer || !offer.id) return;
    offers.set(offer.id, offer);
    broadcastNewOffer(offer, cancellerId);
    socket.emit('offer:ack', { offerId: offer.id });
  });

  socket.on('disconnect', (reason) => {
    removeSocket(socket.id);
    console.log(`- socket disconnected ${socket.id} (${reason})`);
  });
});

// ---------------------------------------------------------------
// Serve the React production build from the same process so a single
// EC2 box can host both the SPA and the realtime API on one port.
// Only enabled if /build exists (i.e. you ran `npm run build` first).
// ---------------------------------------------------------------
if (fs.existsSync(STATIC_DIR)) {
  console.log(`serving static SPA from ${STATIC_DIR}`);
  app.use(express.static(STATIC_DIR, { maxAge: '1d', index: false }));
  // SPA fallback — any GET that didn't match an API route returns index.html
  // (HashRouter handles routing client-side after that).
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/socket.io')) return next();
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
  });
} else {
  console.log(`(no static build at ${STATIC_DIR} — running API only)`);
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`RevPar realtime server listening on http://0.0.0.0:${PORT}`);
});
