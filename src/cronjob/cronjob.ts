import { DateTime } from 'luxon';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

export class CronJob {
  constructor() {
    console.log('Cron job started');

    // Setiap jam 00:00
    cron.schedule('0 0 * * *', () => this.cleanOldLogs());
  }

  private cleanOldLogs() {
    const logDir = path.resolve(__dirname, '../../logs'); // Ubah path sesuai strukturmu
    const files = fs.readdirSync(logDir);

    const now = DateTime.now();

    files.forEach((file) => {
      const filePath = path.join(logDir, file);

      // Abaikan file .gitkeep
      if (file === '.gitkeep') return;

      const stats = fs.statSync(filePath);
      const fileModifiedDate = DateTime.fromJSDate(stats.mtime);

      const diffInDays = now.diff(fileModifiedDate, 'days').days;

      if (diffInDays > 7) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    });
  }
}
