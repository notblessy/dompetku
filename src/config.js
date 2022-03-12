require('dotenv').config();

const env = process.env;

export default {
  ENV: env.NODE_ENV,
  PORT: +env.PORT,

  JWT_SECRET: env.JWT_SECRET,
  JWT_ISSUER: env.JWT_ISSUER,
  JWT_ALGORITHM: env.JWT_ALGORITHM,

  MYSQL_CONNECTION: env.MYSQL_CONNECTION,

  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
};
