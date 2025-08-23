/* globalTeardown.ts */
import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

export default async function globalTeardown() {
  /* 1️⃣  Load env‑file (untuk memastikan variabel ENV test tetap berlaku) */
  const envFile = `.env.${process.env.NODE_ENV || 'test'}`;
  const envPath = path.resolve(process.cwd(), envFile);
  dotenv.config({ path: envPath });
  console.log(`[globalTeardown] Using env file: ${envPath}`);

  /* 2️⃣  Rollback semua migrasi */
  await new Promise<void>((resolve, reject) => {
    // `undo:all` akan mengembalikan semua migrasi ke kondisi sebelum migrasi pertama
    exec('npx sequelize-cli db:migrate:undo:all --env test', (err, stdout, stderr) => {
      if (err) {
        console.error('[Rollback Error]', stderr);
        return reject(err);
      }
      console.log('[Rollback Success]', stdout);
      resolve();
    });
  });
}
