// ═══════════════════════════════════════════════════════════════════════════
// Socket.IO client wrapper
// ───────────────────────────────────────────────────────────────────────────
// Thin singleton around socket.io-client so AppContext can:
//   - connect when a user logs in
//   - send `cancellation:created` when this user cancels
//   - subscribe to `offer:new` and `sync:offers` events from other users
//
// Failure mode: if the backend is unreachable, every method is a no-op and
// the rest of the app keeps working off localStorage. This is intentional
// for MVP / offline demos.
// ═══════════════════════════════════════════════════════════════════════════

import { io } from 'socket.io-client';
import { appConfig } from '../config/appConfig';

let socket = null;
let currentUserId = null;

/**
 * Lazily create & connect a socket. Idempotent.
 * @param {string|number} userId
 */
export function connectSocket(userId) {
  if (!userId) return null;

  if (socket && currentUserId === userId) return socket;

  if (socket && currentUserId !== userId) {
    disconnectSocket();
  }

  // Empty / unset socketUrl = connect to the page's own origin. This is
  // what we want in production when one EC2 box serves both the SPA and
  // the Socket.IO API.
  const url = appConfig.socketUrl;
  const ioOptions = {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 8000,
    timeout: 8000,
    autoConnect: true,
  };

  // eslint-disable-next-line no-console
  console.log('[socket] connecting to', url || '(same origin)', 'as user', userId);
  socket = url ? io(url, ioOptions) : io(ioOptions);

  currentUserId = userId;

  socket.on('connect', () => {
    // eslint-disable-next-line no-console
    console.log('[socket] connected', socket.id);
    socket.emit('identify', { userId });
  });

  socket.on('connect_error', (err) => {
    // eslint-disable-next-line no-console
    console.warn('[socket] connect_error:', err && err.message);
  });

  socket.on('disconnect', (reason) => {
    // eslint-disable-next-line no-console
    console.log('[socket] disconnected:', reason);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    try {
      socket.removeAllListeners();
      socket.disconnect();
    } catch (_) {
      /* ignore */
    }
  }
  socket = null;
  currentUserId = null;
}

export function getSocket() {
  return socket;
}

/** Broadcast a new offer from a cancellation. */
export function emitCancellation(offer, cancellerId) {
  if (!socket || !socket.connected) {
    // eslint-disable-next-line no-console
    console.warn('[socket] not connected; cancellation broadcast skipped');
    return false;
  }
  socket.emit('cancellation:created', { offer, cancellerId });
  return true;
}

/**
 * Subscribe to inbound offer events.
 * @param {(offer: object) => void} onOffer
 * @param {(offers: object[]) => void} [onSync]
 * @returns {() => void} unsubscribe
 */
export function onOfferEvents(onOffer, onSync) {
  if (!socket) return () => {};

  const offerHandler = (offer) => {
    try {
      onOffer && onOffer(offer);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[socket] onOffer handler threw', e);
    }
  };
  const syncHandler = (payload) => {
    try {
      if (onSync && payload && Array.isArray(payload.offers)) {
        onSync(payload.offers);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[socket] onSync handler threw', e);
    }
  };

  socket.on('offer:new', offerHandler);
  socket.on('sync:offers', syncHandler);

  return () => {
    if (!socket) return;
    socket.off('offer:new', offerHandler);
    socket.off('sync:offers', syncHandler);
  };
}
