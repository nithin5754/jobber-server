import { IBaseRepository, IRepoRequest } from "../../Shared/IBaseRepository";
import { IRepoResponse } from "./IUser.repository";



export interface IChatRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {

}