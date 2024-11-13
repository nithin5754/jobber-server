


import { IBuyer } from "../Entities/Buyer";




export interface IBuyerService{
   getBuyerByEmail (email: string): Promise<IBuyer | null> 
   getBuyerByUsername (username: string): Promise<IBuyer | null> 
}