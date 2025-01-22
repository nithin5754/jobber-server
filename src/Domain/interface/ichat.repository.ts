import { IBaseRepository, IRepoRequest } from "../../Shared/IBase-repository";
import { IRepoResponse } from "./IUser.repository";



export interface IChatRepositories extends IBaseRepository<IRepoRequest,IRepoResponse> {

}