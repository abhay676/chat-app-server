import { config } from 'dotenv';

if (config().error) {
  throw new Error('.env not found!');
}

export const Config = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  KEY: process.env.KEY,
};
