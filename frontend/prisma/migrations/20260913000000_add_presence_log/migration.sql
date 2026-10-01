-- Historique de présence des festivaliers (ping GPS périodique, Phase 2
-- statistiques). Pas de FK vers "Festivaliers" : un ping peut arriver avant
-- que l'onboarding ne soit complété.
CREATE TABLE "PresenceLog" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "siteId" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresenceLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PresenceLog_uuid_createdAt_idx" ON "PresenceLog"("uuid", "createdAt");

CREATE INDEX "PresenceLog_createdAt_idx" ON "PresenceLog"("createdAt");

CREATE INDEX "PresenceLog_siteId_idx" ON "PresenceLog"("siteId");

-- AddForeignKey
ALTER TABLE "PresenceLog" ADD CONSTRAINT "PresenceLog_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;
