import { Server, Socket } from "socket.io";
import { SocketHandler } from "../SocketHandler";
import { CacheLoginUser } from "../../../databse/cache/Cache";
import { SocketEvents } from "../SocketIOAppHandler";



export class UserEventHandler extends SocketHandler {
  private loginCache:CacheLoginUser

  constructor(io:Server){
    super(io)
    this.loginCache=new CacheLoginUser()

  }


  public registerEvents(socket: Socket): void {
    
    socket.on(SocketEvents.LOGGED_IN_USERS, (userId: string) => {


      try {
          this.loginCache.saveLoggedInUserToCache(userId, socket.id);
          this.io.emit(SocketEvents.ONLINE, this.loginCache.onlineUsers);

      } catch (err) {
          console.error('Error in loggedInUsers:', err);
      }
  });

     socket.on(SocketEvents.GET_LOGGED_IN_USERS, (userId: string) => {
      try {
        this.loginCache.getLoggedInUsersFromCache(userId)
          this.io.emit(SocketEvents.ONLINE, this.loginCache.onlineUsers);
      } catch (err) {
          console.error('Error in getLoggedInUsers:', err);
      }
  });


 
          socket.on(SocketEvents.REMOVE_LOGGED_IN_USER, (userId: string) => {
            try {
                const success = this.loginCache.removeLoggedInUserFromCache(userId);
                // if (success) {
                //     console.log(`User removed from cache: Socket ID ${userId}`);
                // }
            } catch (err) {
                console.error('Error in removeLoggedInUser:', err);
            }
        });


      
               socket.on(SocketEvents.DISCONNECT, () => {
                console.log(`Socket disconnected: ${socket.id}`);
                this.loginCache.removeLoggedInUserFromCache(socket.id);
            });
      
  }
  
}