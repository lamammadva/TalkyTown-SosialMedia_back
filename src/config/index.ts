import * as path from "path";
import * as dotenv from "dotenv";

const envpPath = path.join(__dirname, "../../.env");
dotenv.config({ path: envpPath });

export default {
  port: process.env.PORT,
  database: {
    username: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
  },
  jwtsecret:process.env.JWT_SECRET,
  app_url: process.env.APP_URL,
  smtp:{
    host:process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    user:process.env.SMTP_USER,
    password: process.env.SMTP_PASSOWRD,

  }
};
