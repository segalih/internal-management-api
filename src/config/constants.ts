import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const configConstants = {
  DB_NAME: process.env.DB_NAME ?? 'eventopia',
  DB_USER: process.env.DB_USER ?? 'root',
  DB_PASS: process.env.DB_PASS ?? 'db_pass',
  DB_HOST: process.env.DB_HOST ?? '127.0.0.1',
  DB_PORT: parseInt(process.env.DB_PORT ?? '1433', 10),
  DB_DIALECT: process.env.DB_DIALECT ?? 'mysql',
  DB_MAX_POOL: parseInt(process.env.MAX_POOL ?? '20', 10),
  DB_MIN_POOL: parseInt(process.env.MIN_POOL ?? '1', 10),
  JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN ?? 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
  JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN ?? 'secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  MINIO_HOST: process.env.MINIO_HOST ?? '127.0.0.1',
  MINIO_PORT: parseInt(process.env.MINIO_PORT ?? '9000', 10),
  MINIO_USE_SSL: process.env.MINIO_USE_SSL ?? 'false',
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY ?? 'minio',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY ?? 'minio123',
  SMTP_HOST: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  SMTP_SERVICE: process.env.SMTP_SERVICE ?? 'gmail',
  SMTP_PORT: parseInt(process.env.SMTP_PORT ?? '465'),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true' ? true : false,
  SMTP_USER: process.env.SMTP_USER ?? '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? '',
  FE_HOST: process.env.FE_HOST ?? '',
  FE_PORT: parseInt(process.env.FE_PORT ?? '5173', 10) ?? 5173,
  API_URL: `${process.env.BE_HOST ?? 'http://localhost'}:${process.env.PORT ?? '8000'}`,
  OPEN_CAGE_API_KEY: process.env.OPEN_CAGE_API_KEY ?? '',
  RAJA_ONGKIR_URL: process.env.RAJA_ONGKIR_URL ?? 'https://api.rajaongkir.com',
  RAJA_ONGKIR_KEY: process.env.RAJA_ONGKIR_KEY ?? '',
};
console.log('configConstants', configConstants);

export default configConstants;
