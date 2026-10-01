-- Abonnements push navigateur (Web Push API)
CREATE TABLE "PushSubscriptions" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PushSubscriptions_endpoint_key" ON "PushSubscriptions"("endpoint");

CREATE INDEX "PushSubscriptions_uuid_idx" ON "PushSubscriptions"("uuid");
