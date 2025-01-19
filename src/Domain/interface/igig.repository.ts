import { IBaseRepository, IRepoRequest } from "../../shared/IBase-repository";
import { IRepoResponse } from "./IUser.repository";




export interface IGigRepository extends IBaseRepository<IRepoRequest,IRepoResponse> {
  countGig():Promise<number>
}