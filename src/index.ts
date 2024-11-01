import express, { Application } from "express";
import mongoose from 'mongoose';
import expressConfig from "./frameworks/webserver/express";
import config from "./config";

import serverConfig from "./frameworks/webserver/server";
import connection from "./frameworks/databse/mongoose/connection";
const app: Application = express();
// const router: Router = express.Router()

expressConfig(app,config)



connection(mongoose,config).connectToMongo()

serverConfig(app,config).startServer()