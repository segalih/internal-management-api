import Database from './src/config/db';

export default async function globalTeardown() {
  await Database.database.close();
}
