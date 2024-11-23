

import crypto from 'crypto'
import { IUniqueId } from "./iuniqueId.interface";
import { v4 as uuidV4 } from "uuid";



export class UniqueId implements IUniqueId {

  private length:number

   constructor(){
    this.length=20
   }
   createUuid(): string {
    return  uuidV4();
     }

 async createRandomBytes(): Promise<Buffer> {
   
  return Promise.resolve(crypto.randomBytes(this.length))
  }
}