import { Server, Socket } from 'socket.io';
import { SocketHandler } from '../SocketHandler';
import { CacheLoginUser, OnlineUserType } from '../../../databse/cache/Cache';
import { SocketEvents } from '../SocketIOAppHandler';

export class UserEventHandler extends SocketHandler {
  private loginCache: CacheLoginUser;

  constructor(io: Server) {
    super(io);
    this.loginCache = new CacheLoginUser();
  }

  public registerEvents(socket: Socket): void {
    socket.on(SocketEvents.LOGGED_IN_USERS, (userId: string, username: string) => {
      try {
        this.loginCache.saveLoggedInUserToCache(userId, socket.id, username);
        this.io.emit(SocketEvents.ONLINE, this.loginCache.onlineUsers);
      } catch (err) {
        console.error('Error in loggedInUsers:', err);
      }
    });

    socket.on(SocketEvents.GET_LOGGED_IN_USERS, () => {
      try {
        const result: OnlineUserType[] = this.loginCache.getLoggedInUsersFromCache();
        this.io.emit(SocketEvents.ONLINE, result);
      } catch (err) {
        console.error('Error in getLoggedInUsers:', err);
      }
    });

    socket.on(SocketEvents.REMOVE_LOGGED_IN_USER, (username: string) => {
      try {
        const success = this.loginCache.removeLoggedInUserFromCache(username);
        if (success) {
          console.log(`User removed from cache: Socket ID ${username}`);
        }
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
