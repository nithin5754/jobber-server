export type OnlineUserType = {
  userId: string;
  socketId: string;
};

export class CacheLoginUser {
  public onlineUsers: OnlineUserType[] = [];


  public saveLoggedInUserToCache(userId: string, socketId: string):  void{
    const existingUser = this.onlineUsers.find(user => user.userId === userId);
    if (!existingUser) {
      this.onlineUsers.push({ userId, socketId });
    }

    
    
  }

  public getLoggedInUsersFromCache(userId: string):void{
   this.onlineUsers.find((user: OnlineUserType) => user.userId === userId);

  }
  public removeLoggedInUserFromCache(userId: string): boolean {
    this.onlineUsers = this.onlineUsers.filter((user) => user.userId !== userId);

       return true
  }
}
