import { ICrypto } from "./ICrypto";

import crypto from 'crypto'



export class Crypto implements ICrypto {

  private length:number

   constructor(){
    this.length=20
   }

 async createRandomBytes(): Promise<Buffer> {
   
  return Promise.resolve(crypto.randomBytes(this.length))
  }
}