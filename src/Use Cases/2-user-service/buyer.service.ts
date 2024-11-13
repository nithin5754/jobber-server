import { IBuyer } from "../../Entities/Buyer";
import { IBuyerRepository } from "../../Interfaces/IBuyerRepo";
import { IBuyerService } from "../../Interfaces/IBuyerService";



export class BuyerService implements IBuyerService {
  constructor(
    private buyerRepo:IBuyerRepository
  ) {
    
  }
  getBuyerByEmail(email: string): Promise<IBuyer | null> {
   return this.buyerRepo.buyerByEmail(email)
  }
  getBuyerByUsername(username: string): Promise<IBuyer | null> {
   return this.buyerRepo.buyerByUsername(username)
  }
}