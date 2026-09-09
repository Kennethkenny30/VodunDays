// Identite festivalier anonyme, partagee par les quiz (Answers.uuid),
// les urgences et l'onboarding (Festivaliers.uuid). Persistee en localStorage
// sous la meme cle que celle deja utilisee par WeatherWidget et app/urgences.

const STORAGE_KEY = "vd_uuid";

export function getOrCreateFestivalierUuid(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let uuid = localStorage.getItem(STORAGE_KEY);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, uuid);
  }
  return uuid;
}
