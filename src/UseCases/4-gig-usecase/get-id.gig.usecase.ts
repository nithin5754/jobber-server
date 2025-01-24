import { findOneGIG } from "../../Database/Mongoose/Repositories/gig.repository";
import { findOneByUser } from "../../Database/Mongoose/Repositories/UserRespository";
import { SellerGig } from "../../Entities/gig.entity";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";





export interface ISellerGigGetByIdDTO {
  gigId: string;

}

export interface ISellerGigGetByIdResult {
  gig:SellerGig
}

export class GetByIdSellerGig {

  public async execute(input: ISellerGigGetByIdDTO): Promise<ISellerGigGetByIdResult> {
    
    const found:IRepoResponse=await findOneGIG({
      gig:{
        _id:input.gigId,
      
      }
    })

   

    if(!found||!found.gig||found.isNull){
      throw new BadRequestError('Not Found, Using GigId', 'GetById Controller() Error');
    }

    await this.addUserDetails(found.gig)

    return {
      gig:found.gig
    }
  }



  private async addUserDetails(gig: SellerGig): Promise<void> {
    const userDetails: IRepoResponse = await findOneByUser({ data: { _id: gig.userId} });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `Get User Gig Usecase() Not Found by `);
    }

    gig.username = userDetails.user?.username;
    gig.profilePicture = userDetails.user?.profilePicture;
    gig.email = userDetails.user?.email;
  }



}