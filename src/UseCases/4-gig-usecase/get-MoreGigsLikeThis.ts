import { findOneGIG } from "../../Database/Mongoose/Repositories/gig.repository";
import { getMoreLikeThisSearch } from "../../Database/Mongoose/Repositories/search.gig.repository";
import { findOneByUser } from "../../Database/Mongoose/Repositories/UserRespository";
import { SellerGig } from "../../Entities/gig.entity";
import { IRepoResponse } from "../../IBaseRepositories";
import { BadRequestError } from "../../Presentation/Error/errorInterface";



export interface MoreLikeThisDTO {
  gigId: string;
}

export interface MoreLikeThisResult {
  gigArray: SellerGig[];

}


export class MoreLikeThisUsecase  {

 public async execute(input: MoreLikeThisDTO): Promise<MoreLikeThisResult> {



  const gigDetails:IRepoResponse=await findOneGIG({gig:{_id:input.gigId}})

  if(!gigDetails||!gigDetails.gig||gigDetails.isNull){
    return {
      gigArray: []   

    };
  }



      const result=await getMoreLikeThisSearch({
        gig_moreLike_filter:{basicDescription:gigDetails.gig?.basicDescription,categories:gigDetails.gig.categories,expectedDelivery:gigDetails.gig.expectedDelivery,id:input.gigId}
      })



      result.gigArray&& await  this.addUserDetails(result.gigArray) 

      return {
        gigArray:  result.gigArray??[]   

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