-- Nouvelle catégorie de marqueur pour les scènes de concert
ALTER TYPE "MarkerCategory" ADD VALUE 'SCENE';

-- Fiche artiste enrichie (bio, photo, genre musical, réseaux, ordre de passage)
ALTER TABLE "Artists" ADD COLUMN "bio" TEXT;
ALTER TABLE "Artists" ADD COLUMN "bioEn" TEXT;
ALTER TABLE "Artists" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Artists" ADD COLUMN "genre" TEXT;
ALTER TABLE "Artists" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "Artists" ADD COLUMN "spotifyUrl" TEXT;
ALTER TABLE "Artists" ADD COLUMN "websiteUrl" TEXT;
ALTER TABLE "Artists" ADD COLUMN "order" INTEGER;

-- Line-up : plusieurs artistes possibles sur un même créneau (b2b, collectif)
CREATE TABLE "_ArtistsToPrograms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_ArtistsToPrograms_AB_unique" ON "_ArtistsToPrograms"("A", "B");

CREATE INDEX "_ArtistsToPrograms_B_index" ON "_ArtistsToPrograms"("B");

ALTER TABLE "_ArtistsToPrograms" ADD CONSTRAINT "_ArtistsToPrograms_A_fkey" FOREIGN KEY ("A") REFERENCES "Artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_ArtistsToPrograms" ADD CONSTRAINT "_ArtistsToPrograms_B_fkey" FOREIGN KEY ("B") REFERENCES "Programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
