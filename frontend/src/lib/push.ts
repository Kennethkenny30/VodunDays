import { subscribeToPush, unsubscribeFromPush } from "@/lib/api/push";

// Convertit la cle publique VAPID (base64 URL-safe) au format Uint8Array
// attendu par pushManager.subscribe - conversion standard, pas de lib dediee.
function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const base64Safe = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64Safe);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i);
  }
  return bytes;
}

export type EnablePushResult =
  | { ok: true }
  | { ok: false; reason: "unsupported" | "denied" | "missing-key" | "error" };

export async function enablePush(uuid: string): Promise<EnablePushResult> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, reason: "unsupported" };
  }

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) {
    return { ok: false, reason: "missing-key" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, reason: "denied" };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    const subscription = existing ?? (await subscribeWithRetry(registration, vapidKey));

    const json = subscription.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
      return { ok: false, reason: "error" };
    }

    const res = await subscribeToPush({
      uuid,
      subscription: {
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      },
    });

    return res.success ? { ok: true } : { ok: false, reason: "error" };
  } catch (error) {
    // Erreur visible en console plutot qu'avalee silencieusement : sans ca,
    // un echec de subscribe() (frequent juste apres un unsubscribe() sur
    // Android/iOS, le temps que le service push cote navigateur se libere)
    // se traduisait par un toggle qui revient a off sans aucune trace.
    console.error("[push] enablePush a echoue:", error);
    return { ok: false, reason: "error" };
  }
}

// Un pushManager.subscribe() juste apres un unsubscribe() peut echouer sur
// Android (InvalidStateError) et iOS (AbortError) le temps que le service
// push du navigateur libere vraiment l'ancien abonnement. On retente une
// fois apres avoir force le nettoyage d'un eventuel abonnement fantome.
async function subscribeWithRetry(
  registration: ServiceWorkerRegistration,
  vapidKey: string
): Promise<PushSubscription> {
  try {
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  } catch (firstError) {
    console.warn("[push] premier subscribe() echoue, nouvelle tentative:", firstError);

    const lingering = await registration.pushManager.getSubscription();
    if (lingering) await lingering.unsubscribe();

    await new Promise((resolve) => setTimeout(resolve, 300));

    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  }
}

export async function disablePush(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;

    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();
    await unsubscribeFromPush(endpoint);
  } catch (error) {
    console.error("[push] disablePush a echoue:", error);
    // Au pire l'abonnement reste orphelin cote serveur, il sera nettoye
    // au prochain envoi (410/404 gere par le backend).
  }
}