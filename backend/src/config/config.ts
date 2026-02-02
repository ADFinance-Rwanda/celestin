import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  connectionString: `${process.env.DATABASE_URL}`,
  host: process.env.HOST || 'localhost',
  apiVersion: process.env.API_VERSION || 'v1',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4200',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
} as const;

export default config;
