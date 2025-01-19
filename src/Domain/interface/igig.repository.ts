import { IBaseRepository, IRepoRequest } from "../../shared/IBase-repository";
import { IRepoResponse } from "./iuser.repository";




export interface IGigRepository extends IBaseRepository<IRepoRequest,IRepoResponse> {
  countGig():Promise<number>
}