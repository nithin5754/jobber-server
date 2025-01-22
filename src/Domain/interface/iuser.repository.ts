import { IBaseRepository, IRepoRequest, IRepoResponse } from "../../Shared/IBase-repository";






export interface IUserRepository extends IBaseRepository<IRepoRequest,IRepoResponse> {

  findOne(criteria: IRepoRequest): Promise<IRepoResponse>

  updateUsingOtherFields({filter, data}: IRepoRequest): Promise<IRepoResponse> 

   isUsernameOrEmailExist(username:string,email:string):Promise<{username:boolean,email:boolean}> 
}

export { IRepoResponse };
