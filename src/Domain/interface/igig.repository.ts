import { IBaseRepository, IRepoRequest } from "../../shared/ibase-repository";
import { IRepoResponse } from "./iuser.repository";




export interface IGigRepository extends IBaseRepository<IRepoRequest,IRepoResponse> {
  countGig():Promise<number>
}