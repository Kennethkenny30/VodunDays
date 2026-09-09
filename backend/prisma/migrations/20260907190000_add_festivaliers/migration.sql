-- Enums du profil festivalier
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNDISCLOSED');

CREATE TYPE "AgeRange" AS ENUM (
    'UNDER_18',
    'FROM_18_TO_24',
    'FROM_25_TO_34',
    'FROM_35_TO_44',
    'FROM_45_TO_54',
    'FROM_55_AND_ABOVE'
);

CREATE TYPE "FestivalEdition" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH_AND_ABOVE');

-- Table du profil festivalier anonyme (onboarding premiere ouverture)
CREATE TABLE "Festivaliers" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "gender" "Gender" NOT NULL,
    "ageRange" "AgeRange" NOT NULL,
    "nationality" TEXT NOT NULL,
    "edition" "FestivalEdition" NOT NULL,
    "onboardingCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Festivaliers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Festivaliers_uuid_key" ON "Festivaliers"("uuid");

CREATE INDEX "Festivaliers_createdAt_idx" ON "Festivaliers"("createdAt");
