import { Server, Socket } from "socket.io";
import { SocketHandler } from "./SocketHandler";
import { GeneralEventHandler } from "./events/GeneralEventHandler";
import { UserEventHandler } from "./events/UserEventHandler";





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
      new GeneralEventHandler(io)
    ];
  }


  public listen():void {


    this.io.on(SocketEvents.CONNECTION,(socket:Socket)=>{

 

      this.eventHandler.forEach((handler)=>handler.registerEvents(socket))
    })
  }
}