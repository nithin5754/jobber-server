import { IBuyer } from "../Entities/Buyer";




export interface IBuyerRepository {
   buyerByEmail (email: string): Promise<IBuyer | null> 
   buyerByUsername (username: string): Promise<IBuyer | null> 
}