import dotenv from "dotenv";

import cloudinary from 'cloudinary'

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
  CLOUDINARY_:{
  CLOUDINARYCLOUDNAME:process.env.CLOUDINARY_CLOUD_NAME as string,
CLOUDINARYAPIKEY:process.env.CLOUDINARY_API_KEY as string,
CLOUDINARYAPISECRET:process.env.CLOUDINARY_API_SECRET as string
  },
  JWT_:{
    ACCESS_TOKEN:process.env.JWT_SECRET_TOKEN as string,
    REFRESH_TOKEN:process.env.JWT_REFRESH_TOKEN as string
  }
};



export class CloudinaryConfigClass {
    
  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: config.CLOUDINARY_.CLOUDINARYCLOUDNAME,
      api_key:config.CLOUDINARY_.CLOUDINARYAPIKEY,
      api_secret: config.CLOUDINARY_.CLOUDINARYAPISECRET
    });
  }
}

export type ConfigType = typeof config;

export default config;
