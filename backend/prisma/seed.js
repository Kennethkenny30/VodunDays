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

async function main() {
  console.log("🌱 Démarrage du seed...\n");

  for (const account of accounts) {
    const existing = await prisma.users.findUnique({
      where: { email: account.email },
    });

    if (existing) {
      console.log(`⏭  Compte existant ignoré : ${account.email}`);
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

    console.log(`✅ Compte créé : ${account.email} (${account.role})`);
  }

  console.log("\n🎉 Seed terminé.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed :", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());