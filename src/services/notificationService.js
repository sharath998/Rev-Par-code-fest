// ═══════════════════════════════════════════════════════════════════════════
// Notification service
// ───────────────────────────────────────────────────────────────────────────
// Platform-aware:
//   - On Android (inside Capacitor): real system-tray notification via
//     @capacitor/local-notifications. Works in foreground & background.
//   - On Web (CRA dev / browser): in-app toast via react-hot-toast.
//
// Capacitor is loaded lazily so plain web builds don't crash if the plugin
// isn't installed yet.
// ═══════════════════════════════════════════════════════════════════════════

import toast from 'react-hot-toast';

let CapacitorRef = null;
let LocalNotificationsRef = null;
let permissionRequested = false;
let permissionGranted = false;

async function loadCapacitor() {
  if (CapacitorRef && LocalNotificationsRef) return true;
  try {
    const core = await import('@capacitor/core');
    CapacitorRef = core.Capacitor;
    if (!CapacitorRef || !CapacitorRef.isNativePlatform || !CapacitorRef.isNativePlatform()) {
      return false;
    }
    const ln = await import('@capacitor/local-notifications');
    LocalNotificationsRef = ln.LocalNotifications;
    return Boolean(LocalNotificationsRef);
  } catch (e) {
    // Plugin not available (web build, missing install, etc.)
    return false;
  }
}

export async function isNativeNotificationsAvailable() {
  return loadCapacitor();
}

export async function ensurePermission() {
  const native = await loadCapacitor();
  if (!native) return false;
  if (permissionGranted) return true;
  if (permissionRequested && !permissionGranted) {
    // Try again — user may have changed system settings
  }
  permissionRequested = true;
  try {
    const status = await LocalNotificationsRef.checkPermissions();
    if (status.display === 'granted') {
      permissionGranted = true;
      return true;
    }
    const req = await LocalNotificationsRef.requestPermissions();
    permissionGranted = req.display === 'granted';
    return permissionGranted;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[notifications] permission check failed', e);
    return false;
  }
}

/**
 * Show a notification.
 *   - System tray on Android (via LocalNotifications)
 *   - Toast on web
 *
 * @param {{ title: string, body: string, data?: object }} payload
 */
export async function notify({ title, body, data }) {
  const native = await loadCapacitor();
  if (native) {
    const ok = await ensurePermission();
    if (!ok) {
      // Fall back to toast if permission denied
      toast(title + ' — ' + body);
      return;
    }
    try {
      await LocalNotificationsRef.schedule({
        notifications: [
          {
            id: Math.floor(Date.now() % 2147483647),
            title,
            body,
            schedule: { at: new Date(Date.now() + 100) },
            sound: 'default',
            smallIcon: 'ic_stat_icon_config_sample',
            extra: data || {},
          },
        ],
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[notifications] schedule failed, falling back to toast', e);
      toast(title + ' — ' + body);
    }
    return;
  }

  // Web fallback
  toast.success(title + ' — ' + body, { duration: 60000 });
}

/**
 * Wire a tap-handler that fires when the user taps the notification.
 * Use this in App startup to navigate to the offer screen, etc.
 *
 * @param {(payload: { extra: object }) => void} handler
 * @returns {() => void} unsubscribe (best-effort)
 */
export async function onNotificationTap(handler) {
  const native = await loadCapacitor();
  if (!native) return () => {};
  try {
    const sub = await LocalNotificationsRef.addListener(
      'localNotificationActionPerformed',
      (event) => {
        try {
          handler && handler({ extra: (event && event.notification && event.notification.extra) || {} });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('[notifications] tap handler threw', e);
        }
      }
    );
    return () => sub && sub.remove && sub.remove();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[notifications] addListener failed', e);
    return () => {};
  }
}
