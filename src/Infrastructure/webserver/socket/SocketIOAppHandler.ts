import { Server, Socket } from "socket.io";
import { SocketHandler } from "./SocketHandler";
import { GeneralEventHandler } from "./events/GeneralEventHandler";
import { UserEventHandler } from "./events/UserEventHandler";
import { CategoryEventHandler } from "./events/CategoryEventHandler";
import { CacheLoginUser } from "../../databse/cache/Cache";





export const SocketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  GET_LOGGED_IN_USERS: 'getLoggedInUsers',
  LOGGED_IN_USERS: 'loggedInUsers',
  REMOVE_LOGGED_IN_USER: 'removeLoggedInUser',
  ONLINE: 'online',
  OFFLINE: 'offline',
  ERROR: 'error',
};

export class SocketIOAppHandler {
  private readonly eventHandler: SocketHandler[];

  constructor(private readonly io: Server) {
    this.eventHandler = [
      new UserEventHandler(io),
      new GeneralEventHandler(io),
      new CategoryEventHandler(io)
    ];
  }


  public listen():void {


    this.io.on(SocketEvents.CONNECTION,(socket:Socket)=>{

      this.eventHandler.forEach((handler)=>handler.registerEvents(socket))
    })
  }
}