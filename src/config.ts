import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 4000,
  MONGO_: {
    URI: process.env.MONGO_URI as string,
  },
  NODE_ENVIRONMENT: process.env.NODEENVIRONMENT as string,

  NODEMAILER_: {
    PASSWORD_NODEMAILER: process.env.PASSWORD_NODEMAIL as string,
    EMAIL_NODEMAILER: process.env.EMAIL_NODEMAIL as string,
    EMAIL_NODEMAIL_PROVIDER: process.env.EMAIL_NODEMAIL_PROVIDER as string,
  },
  URL_: {
    CLIENT_URL: process.env.CLIENT as string,
  },
};

export type ConfigType = typeof config;

export default config;
