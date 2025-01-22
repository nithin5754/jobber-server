




import { Server, Socket } from "socket.io";
import { SocketHandler } from "../SocketHandler";
import { CacheLoginUser } from "../../../databse/cache/Cache";




export class CategoryEventHandler extends SocketHandler {
  private gatewayCache:CacheLoginUser

  constructor(io:Server){
    super(io)
    this.gatewayCache=new CacheLoginUser()

  }

  public registerEvents(socket: Socket): void {
    socket.on('category', async (category: string, username: string) => {
       if(username&&category){
        this.gatewayCache.saveUserSelectedCategory(`selectedCategories:${username}`, `${category}`);
       }
    });

  }
  






}