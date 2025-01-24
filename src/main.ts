import express, { Application, Router } from 'express';
import mongoose from 'mongoose';

import config from './config';
import http, { Server as httpServerType } from 'http';

import routes from './Presentation/Routes/main.routes';

import { Server } from 'socket.io';
import ErrorHandlingMiddleWare from './Presentation/middlewares/error-handling.middleware';
import ioMiddleware from './Presentation/middlewares/ioMiddleware';
import expressConfig from './webserver/express';
import serverConfig from './webserver/server';
import { SocketIOAppHandler } from './webserver/socket/SocketIOAppHandler';
import connection from './Database/Mongoose/connection';

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
    origin: [
      'http://localhost:3000',
      'https://jobber-client.vercel.app',
      'http://jobber-client.vercel.app',
      'https://www.jobber.phaseex.live',
       'http://www.jobber.phaseex.live'
    ],

    credentials: true
  }
});

app.use(ioMiddleware(io));

const socketServer = new SocketIOAppHandler(io);

socketServer.listen();

serverConfig(httpServer, config).startServer();
