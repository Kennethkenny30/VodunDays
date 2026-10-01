-- Ajoute la colonne zoneGeo
ALTER TABLE
    "Sites"
ADD
    COLUMN "zoneGeo" geometry(Polygon, 4326);