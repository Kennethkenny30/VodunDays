import bcrypt from "bcryptjs";
import prisma from "./prisma.client.js";

const accounts = [
  {
    email:     "superadmin@vodundays.bj",
    password:  "VodunSuper2026!",
    firstname: "Super",
    lastname:  "Admin",
    role:      "SUPER_ADMIN",
  },
  {
    email:     "admin@vodundays.bj",
    password:  "VodunAdmin2026!",
    firstname: "Admin",
    lastname:  "Culture",
    role:      "ADMIN",
  },
];

// Types de questions canoniques - upsert idempotent sur le libellé
const questionTypes = [
  { types: "Note étoilée",   kind: "RATING"   },
  { types: "Choix unique",   kind: "SINGLE"   },
  { types: "Choix multiple", kind: "MULTIPLE" },
  { types: "Texte libre",    kind: "TEXT"     },
];

async function main() {
  console.log("Démarrage du seed...\n");

  for (const account of accounts) {
    const existing = await prisma.users.findUnique({ where: { email: account.email } });

    if (existing) {
      console.log(`Compte existant ignoré : ${account.email}`);
      continue;
    }

    const hashed = await bcrypt.hash(account.password, 12);
    await prisma.users.create({
      data: {
        email:     account.email,
        password:  hashed,
        firstname: account.firstname,
        lastname:  account.lastname,
        role:      account.role,
        active:    true,
      },
    });
    console.log(`Compte créé : ${account.email} (${account.role})`);
  }

  console.log("\nSeed des types de questions...");
  for (const qt of questionTypes) {
    await prisma.questionsTypes.upsert({
      where:  { types: qt.types },
      update: { kind: qt.kind },
      create: { types: qt.types, kind: qt.kind },
    });
    console.log(`Type upserted : ${qt.types} (${qt.kind})`);
  }

  console.log("\nSeed terminé.");
}

main()
  .catch((e) => {
    console.error("Erreur seed :", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
