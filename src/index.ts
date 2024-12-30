import express, { Application, Router } from "express";
import mongoose from "mongoose";
import expressConfig from "./Infrastructure/webserver/express";
import config from "./config";
import http, { Server as httpServerType } from 'http';
import serverConfig from "./Infrastructure/webserver/server";
import connection from "./Infrastructure/databse/mongoose/connection";
import routes from "./Presentation/Routes/main.routes";
import ErrorHandlingMiddleWare from "./Presentation/middlewares/error-handling.middleware";
import { Server } from "socket.io";
import ioMiddleware from "./Presentation/middlewares/ioMiddleware";
import { SocketIOAppHandler } from "./Infrastructure/webserver/socket/SocketIOAppHandler";
import { CacheLoginUser } from "./Infrastructure/databse/cache/Cache";

const app: Application = express();
const router: Router = express.Router();

expressConfig(app, config);

routes(app, router);
app.use(ErrorHandlingMiddleWare);
connection(mongoose, config).connectToMongo();

const httpServer:httpServerType = http.createServer(app);


const io = new Server(httpServer, {
  transports:['polling'],
  cors: {
    origin: [ 'http://localhost:3000','http://localhost:5173'],
    credentials: true,
  }
  
});
const onlineusers=new CacheLoginUser().onlineUsers

console.log("onlineUser",onlineusers)

app.use(ioMiddleware(io));


    const socketServer=new SocketIOAppHandler(io)
  
 
    socketServer.listen()


  




serverConfig(httpServer, config).startServer();
