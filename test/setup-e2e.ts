import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomUUID } from 'node:crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

const SCHEMA_ID = randomUUID();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Provide a DATABASE_URL environment variable.');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(SCHEMA_ID);

  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${SCHEMA_ID}" CASCADE`);
  await prisma.$disconnect();
});
