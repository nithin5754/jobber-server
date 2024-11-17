


export interface IBaseRepository<TInput,TOutput> {
  create(data:TInput):Promise<TOutput>
  findOne(criteria:TInput):Promise<TOutput>
  update(id:string,data:TInput):Promise<TOutput>
  delete(id:string):Promise<boolean>
}