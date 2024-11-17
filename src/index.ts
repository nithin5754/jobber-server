import express, { Application, Router, json, urlencoded } from "express";
import mongoose from "mongoose";
import expressConfig from "./Infrastructure/webserver/express";
import config from "./config";

import serverConfig from "./Infrastructure/webserver/server";
import connection from "./Infrastructure/databse/mongoose/connection";
import routes from "./Presentation/Routes/main.routes";
import ErrorHandlingMiddleWare from "./Presentation/middlewares/error-handling.middleware";
const app: Application = express();
const router: Router = express.Router();

expressConfig(app, config);

routes(app, router);
app.use(ErrorHandlingMiddleWare);

connection(mongoose, config).connectToMongo();


serverConfig(app, config).startServer();
