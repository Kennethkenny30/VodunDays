import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../src/generated/client.js";

// 1. Setup the adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// 2. Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

// 3. export glopal prisma api
export default prisma;
