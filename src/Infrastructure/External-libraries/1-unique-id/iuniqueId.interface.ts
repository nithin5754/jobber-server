

export interface IUniqueId {
  createRandomBytes():Promise<Buffer>
  createUuid():string

}