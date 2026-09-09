import { api } from "./client";

type PushSubscriptionPayload = {
  uuid: string;
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
};

export async function subscribeToPush(payload: PushSubscriptionPayload) {
  return api.post<null>("/push/subscribe", payload);
}

export async function unsubscribeFromPush(endpoint: string) {
  return api.post<null>("/push/unsubscribe", { endpoint });
}
