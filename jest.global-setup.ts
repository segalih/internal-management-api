import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

export default async function globalSetup() {
  // Tentukan env file
  const envFile = `.env.${process.env.NODE_ENV || 'test'}`;
  const envPath = path.resolve(process.cwd(), envFile);

  // Load env file sebelum migrate
  dotenv.config({ path: envPath });
  console.info(`[globalSetup] Using env file: ${envPath}`);

  // Jalankan migrasi
  await new Promise<void>((resolve, reject) => {
    exec('npx sequelize-cli db:migrate --env test', (err, stdout, stderr) => {
      if (err) {
        console.error('[Migration Error]', stderr);
        return reject(err);
      }
      console.info('[Migration Success]', stdout);
      resolve();
    });
  });
}
