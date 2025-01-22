
import { IBaseRepository, IRepoRequest } from "../../Shared/IBaseRepository";
import { IRepoResponse } from "./IUser.repository";




export interface IGigRepository extends IBaseRepository<IRepoRequest,IRepoResponse> {
  countGig():Promise<number>
}