import express, { Application, Router } from 'express';
import mongoose from 'mongoose';
import expressConfig from './Infrastructure/webserver/express';
import config from './config';
import http, { Server as httpServerType } from 'http';
import serverConfig from './Infrastructure/webserver/server';
import connection from './Infrastructure/Databse/Mongoose/connection';
import routes from './Presentation/Routes/main.routes';
import ErrorHandlingMiddleWare from './Presentation/Middlewares/error-handling.middleware';
import { Server } from 'socket.io';
import ioMiddleware from './Presentation/Middlewares/ioMiddleware';
import { SocketIOAppHandler } from './Infrastructure/webserver/socket/SocketIOAppHandler';
// import { CacheLoginUser } from "./Infrastructure/databse/cache/Cache";

const app: Application = express();
const router: Router = express.Router();
export let io: Server;

expressConfig(app, config);

routes(app, router);
app.use(ErrorHandlingMiddleWare);
connection(mongoose, config).connectToMongo();

const httpServer: httpServerType = http.createServer(app);

io = new Server(httpServer, {
  transports: ['websocket', 'polling'], 
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
  }
});

app.use(ioMiddleware(io));

const socketServer = new SocketIOAppHandler(io);

socketServer.listen();

serverConfig(httpServer, config).startServer();
