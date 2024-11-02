
import { v4 as uuidV4 } from 'uuid';
import { IUuid } from './IUuid';

export class Uuid implements IUuid {
  createUuid(): string {
    return  uuidV4();
     }
  


}