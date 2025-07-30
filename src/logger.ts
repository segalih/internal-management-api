import fs from 'fs';
import path from 'path';
import winston from 'winston';

// Buat folder 'logs' jika belum ada
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Format tanggal file log: YYYY-MM-DD
const currentDate = new Date().toISOString().split('T')[0]; // contoh: '2025-07-30'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf((info) => `[${info.timestamp}] ${info.message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, `${currentDate}.log`),
    }),
  ],
});

export default logger;
