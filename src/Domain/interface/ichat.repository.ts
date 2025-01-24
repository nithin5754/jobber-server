import { IBaseRepository, IRepoRequest } from "../../Shared/IBaseRepositories";
import { IRepoResponse } from "./IUser.repository";



export interface IChatRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {

}