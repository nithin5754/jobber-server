

import dotenv from "dotenv";



dotenv.config()



const config={
  PORT:process.env.PORT||4000,
  MONGO_:{
    URI:process.env.MONGO_URI as string,
  },
  NODE_ENVIRONMENT: process.env.NODEENVIRONMENT as string,
}


export type ConfigType=typeof config


export default config