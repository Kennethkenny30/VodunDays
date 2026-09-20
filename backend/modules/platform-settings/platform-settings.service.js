import prisma from "../../prisma/prisma.client.js";

// Clés reconnues par le dashboard super admin, réparties en deux familles :
// - modules   : fonctionnalités activables/désactivables (ModulesCard)
// - incidents : interrupteurs d'urgence, désactivés par défaut (IncidentCenter)
// La liste vit ici (code) plutôt qu'en base - ajouter/retirer un interrupteur
// ne nécessite pas de migration, juste un déploiement.
export const SETTING_KEYS = {
  modules:   ["map", "push", "gps", "video", "maintenance"],
  incidents: ["degradedMode", "gpsTracking", "pushNotifications"],
};

const ALL_KEYS = new Set([...SETTING_KEYS.modules, ...SETTING_KEYS.incidents]);

export const isKnownKey = (key) => ALL_KEYS.has(key);
const familyOf = (key) => (SETTING_KEYS.modules.includes(key) ? "modules" : "incidents");

// Liste tous les réglages connus, avec repli à false pour toute clé qui
// n'aurait pas encore de ligne en base (ex: nouvelle clé ajoutée après le
// seed initial, avant sa première bascule).
export const list = async () => {
  const rows = await prisma.platformSettings.findMany();
  const byKey = new Map(rows.map((r) => [r.key, r]));

  return [...ALL_KEYS].map((key) => {
    const row = byKey.get(key);
    return {
      key,
      family:        familyOf(key),
      enabled:       row?.enabled ?? false,
      updatedAt:     row?.updatedAt ?? null,
      updatedByName: row?.updatedByName ?? null,
    };
  });
};

// Bascule un réglage et journalise l'action dans AuditLogs dans la même
// transaction (action CONFIG pour un module, INCIDENT pour une mesure
// d'urgence - mêmes codes que ceux déjà utilisés côté ActivityCard).
export const setEnabled = async (key, enabled, actor = {}) => {
  if (!isKnownKey(key)) throw { status: 404, message: "Réglage inconnu" };

  const family = familyOf(key);
  const actorLabel = actor.name ?? "Système";

  const [setting] = await prisma.$transaction([
    prisma.platformSettings.upsert({
      where:  { key },
      create: { key, enabled, updatedById: actor.id ?? null, updatedByName: actor.name ?? null },
      update: { enabled, updatedById: actor.id ?? null, updatedByName: actor.name ?? null },
    }),
    prisma.auditLogs.create({
      data: {
        action:      family === "modules" ? "CONFIG" : "INCIDENT",
        module:      family,
        description: `${actorLabel} a ${enabled ? "activé" : "désactivé"} "${key}"`,
        metadata:    { key, enabled },
        userId:      actor.id ?? null,
        userName:    actor.name ?? null,
      },
    }),
  ]);

  return { ...setting, family };
};
