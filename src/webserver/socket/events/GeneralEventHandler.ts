import { Server, Socket } from "socket.io";
import { SocketHandler } from "../SocketHandler";
import { CacheLoginUser } from "../../../Database/cache/Cache";




export class GeneralEventHandler extends SocketHandler {
  
 private loginCache:CacheLoginUser

  constructor(io:Server){
    super(io)
    this.loginCache=new CacheLoginUser()

  }


  public registerEvents(socket: Socket): void {
       
    socket.on('disconnect',(reason:string)=>{
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
      this.loginCache.removeLoggedInUserFromCache(socket.id);
    })
  }

}