-- CreateTable
CREATE TABLE "PlatformSettings" (
    "key"           TEXT NOT NULL,
    "enabled"       BOOLEAN NOT NULL DEFAULT false,
    "updatedById"   TEXT,
    "updatedByName" TEXT,
    "updatedAt"     TIMESTAMP(3) NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("key")
);

-- AddForeignKey
ALTER TABLE "PlatformSettings"
    ADD CONSTRAINT "PlatformSettings_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "Users"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;

-- Seed des clés connues, valeurs par défaut alignées sur defaultModules
-- (modules-card.tsx) et l'état initial d'incident-center.tsx.
-- ON CONFLICT DO NOTHING : idempotent si la migration est rejouée.
INSERT INTO "PlatformSettings" ("key", "enabled", "updatedAt") VALUES
    ('map',                true,  CURRENT_TIMESTAMP),
    ('push',               true,  CURRENT_TIMESTAMP),
    ('gps',                true,  CURRENT_TIMESTAMP),
    ('video',              false, CURRENT_TIMESTAMP),
    ('maintenance',        false, CURRENT_TIMESTAMP),
    ('degradedMode',       false, CURRENT_TIMESTAMP),
    ('gpsTracking',        false, CURRENT_TIMESTAMP),
    ('pushNotifications',  false, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
