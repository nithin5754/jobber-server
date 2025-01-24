


import { SellerGig } from "../../../Entities/gig.entity";
import { IRepoResponse } from "../../../IBaseRepositories";
import { findByLimitGIG } from "../../../Infrastructure/Database/Mongoose/Repositories/gig.repository";
import { findOneByUser } from "../../../Infrastructure/Database/Mongoose/Repositories/UserRespository";
import { BadRequestError } from "../../../Presentation/Error/errorInterface";
import { firstLetterUpperCase } from "../../../utils/helper.utils";





export interface ISellerGigGetByCategoryDTO {
  category: string;

}

export interface ISellerGigGetByCategoryResult {
  gigs:SellerGig[]
}

export class GetByCategorySellerGig  {

  public async execute(input: ISellerGigGetByCategoryDTO): Promise<ISellerGigGetByCategoryResult> {
    
    const found:IRepoResponse=await findByLimitGIG({
      gig:{
        categories:firstLetterUpperCase(input.category),
        active:true
      }
    },8)

  
   

    if(!found||!found.gigArray||found.isNull){
      throw new BadRequestError('Not Found, Using GigId', 'GetById Controller() Error');
    }

    await this.addUserDetails(found.gigArray)

    return {
     gigs:found.gigArray ??[]
    }
  }



  private async addUserDetails(item: SellerGig[]): Promise<void> {
    for (let i = 0; i < item.length; i++) {
      {
        const userDetails: IRepoResponse = await findOneByUser({ data: { _id: item[i].userId } });

        if (!userDetails) {
          throw new BadRequestError('users not Found', `Get User Gig Usecase() Not Found by `);
        }

        item[i].username = userDetails.user?.username;
        item[i].profilePicture = userDetails.user?.profilePicture;
        item[i].email = userDetails.user?.email;
      }
    }
  }



}