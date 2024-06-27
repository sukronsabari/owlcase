import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClientSingleton() {
  const neon = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaNeon(neon);
  return new PrismaClient({ adapter });
}

// Create singleton prisam and make it support edge runtime
export const prisma = globalForPrisma.prisma || createPrismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
