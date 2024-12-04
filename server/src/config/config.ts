// config.ts
import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  PORT: process.env.PORT || 5050,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/snapFix?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.0",
  NODE_ENV: process.env.NODE_ENV || 'production',
};

export default CONFIG;
