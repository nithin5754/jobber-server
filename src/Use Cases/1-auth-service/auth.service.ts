import { IUser } from "../../Entities/User";
import { IAuthRepository } from "../../Interfaces/IAuthRepository";
import { IAuthService } from "../../Interfaces/IAuthService";



export class AuthService implements IAuthService {
  constructor(private authRepo:IAuthRepository) {
    
  }
 async usernameOrEmail( email:string,username:string): Promise<boolean> {

  return await this.authRepo.getUserByUsernameOrEmail(email,username)

    
  }
async  create(data: IUser): Promise<IUser | undefined> {
    
    return await  this.authRepo.createAuthUser(data)
  }
}