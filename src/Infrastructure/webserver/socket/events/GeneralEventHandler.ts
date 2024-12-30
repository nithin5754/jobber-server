import { Server, Socket } from "socket.io";
import { SocketHandler } from "../SocketHandler";
import { CacheLoginUser } from "../../../databse/cache/Cache";




export class GeneralEventHandler extends SocketHandler {
  
 private loginCache:CacheLoginUser

  constructor(io:Server){
    super(io)
    this.loginCache=new CacheLoginUser()

  }


  public registerEvents(socket: Socket): void {
       
    socket.on('disconnect',(reason:string)=>{
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
      this.loginCache.onlineUsers.filter((user) => user.socketId !== socket.id);
    })
  }

}