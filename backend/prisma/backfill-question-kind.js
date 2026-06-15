// Backfill du champ `kind` sur QuestionsTypes depuis le libellé `types`.
// A exécuter une seule fois après la migration add-question-order-and-kind.
// Usage : node backend/prisma/backfill-question-kind.js

import { PrismaClient } from "../src/generated/index.js";

const prisma = new PrismaClient();

function inferKind(types) {
  const l = types.toLowerCase();
  if (l.includes("note") || l.includes("étoile")) return "RATING";
  if (l.includes("multiple")) return "MULTIPLE";
  if (l.includes("unique") || l.includes("radio") || l.includes("choix")) return "SINGLE";
  return "TEXT";
}

async function main() {
  const allTypes = await prisma.questionsTypes.findMany();

  if (allTypes.length === 0) {
    console.log("Aucun type de question en base - rien à backfiller.");
    return;
  }

  const updates = allTypes.map((t) => {
    const kind = inferKind(t.types);
    return prisma.questionsTypes.update({ where: { id: t.id }, data: { kind } });
  });

  await prisma.$transaction(updates);

  console.log(`Backfill terminé : ${allTypes.length} type(s) mis à jour.`);
  allTypes.forEach((t) => {
    console.log(`  ${t.types} -> ${inferKind(t.types)}`);
  });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
