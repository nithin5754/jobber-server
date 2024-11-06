import express, { Application } from "express";
import morgan from "morgan";
import cookieSession from "cookie-session";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import cors from "cors";
import { CloudinaryConfigClass, ConfigType } from "../../config";


const cloudinary=new CloudinaryConfigClass()

export default function expressConfig(app: Application, _config: ConfigType) {

 


  app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    })
  );


  cloudinary.cloudinaryConfig();
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieSession({ signed: false, secure: false }));
  app.use(helmet({ xssFilter: true }));
  app.use(mongoSanitize());
}
