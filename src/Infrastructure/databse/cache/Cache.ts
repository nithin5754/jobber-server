

export type OnlineUserType = {
  userId: string;
  username: string;
  socketId: string;
};

export interface SelectedCategoryItems {
  username: string;
  value: string;
}

export let selectedCategory: SelectedCategoryItems[] = []

export class CacheLoginUser {
  public onlineUsers: OnlineUserType[] = [];
 

  constructor(){}


  public saveLoggedInUserToCache(userId: string, socketId: string, username: string):OnlineUserType[] {

    const existingUser = this.onlineUsers.find((user) => user.userId === userId);
    const existingUserWithUsername = this.onlineUsers.find((user) => user.username === username);
    if (!existingUser && !existingUserWithUsername) {
      this.onlineUsers.push({ userId, socketId, username });

    }

    return this.onlineUsers
  }

  public  saveUserSelectedCategory(username: string, value: string):void {



    const isExistUsername = selectedCategory.find((item: SelectedCategoryItems) => item.username === username);



    if (isExistUsername) {
      isExistUsername.value = value;
    } else {
      selectedCategory.push({ username, value });
    }

 


  }


 public getUserSelectedGigCategory (key: string,items:SelectedCategoryItems[]):string{
       


     const result=items.find((item:SelectedCategoryItems)=>item.username===key)


   return result?.value??''
    
  };

  public getLoggedInUsersFromCache(): OnlineUserType[] {
  
return this.onlineUsers

  }
  public removeLoggedInUserFromCache(username: string): boolean {
    if (!username || username === '') return false;
    this.onlineUsers = this.onlineUsers.filter((user) => user.username !== username);
    selectedCategory = selectedCategory.filter((item: SelectedCategoryItems) => item.username !== `selectedCategories:${username}`);

    return true;
  }
}
