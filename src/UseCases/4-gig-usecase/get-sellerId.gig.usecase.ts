import { findGIG } from "../../Database/Mongoose/Repositories/gig.repository";
import { findOneByUser } from "../../Database/Mongoose/Repositories/user.respository";
import { SellerGig } from "../../Entities/Gig";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";


export interface ISellerGigGetBySellerIdDTO {
  sellerId: string;
}

export interface ISellerGigGetBySellerIdResult {
  gigArray: SellerGig[];
}

export class GetSellerGigs  {

  public async execute(input: ISellerGigGetBySellerIdDTO): Promise<ISellerGigGetBySellerIdResult> {
    const found: IRepoResponse = await findGIG({
      gig: {
        sellerId: input.sellerId,
        active:true 
      }
    });



    if (!found || !found.gigArray || found.isNull||found.gigArray.length<1) {
      throw new BadRequestError('Not Found, Using SellerId', 'GetSellerGigs Controller() Error');
    }
await this.addUserDetails(found.gigArray)

    return {
      gigArray: found.gigArray
    };
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
