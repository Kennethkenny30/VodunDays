import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../src/generated/client.js";

// 1. Setup the adapter
// connectionTimeoutMillis : abandon si le pool ne repond pas en 10 s
// statement_timeout : annule une requete SQL qui depasse 20 s
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10_000,
  statement_timeout: 20_000,
});
// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

// 3. export global prisma client
export default prisma;
