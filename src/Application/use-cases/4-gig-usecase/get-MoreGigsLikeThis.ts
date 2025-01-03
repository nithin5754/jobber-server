import { SellerGig } from "../../../Domain/Entities/gig.entity";
import { GigRepository } from "../../../Infrastructure/databse/mongoose/Repositories/gig.repository";
import { Search } from "../../../Infrastructure/databse/mongoose/Repositories/search.gig.repository";
import { UserRepository } from "../../../Infrastructure/databse/mongoose/Repositories/user.respository";
import { BadRequestError } from "../../../Presentation/error/error.interface";
import { IRepoRequest, IRepoResponse } from "../../../shared/ibase-repository";
import { IUseCase } from "../../../shared/iusecase";

export interface MoreLikeThisDTO {
  gigId: string;
}

export interface MoreLikeThisResult {
  gigArray: SellerGig[];

}


export class MoreLikeThisUsecase implements IUseCase<MoreLikeThisDTO,MoreLikeThisResult> {

  constructor(private readonly gigSearch: Search, private readonly userservice: UserRepository,private readonly gig:GigRepository) {}
 public async execute(input: MoreLikeThisDTO): Promise<MoreLikeThisResult> {



  const gigDetails:IRepoResponse=await this.gig.findOne({gig:{_id:input.gigId}})

  if(!gigDetails||!gigDetails.gig||gigDetails.isNull){
    return {
      gigArray: []   

    };
  }



      const result=await this.gigSearch.getMoreLikeThis({
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
          const userDetails: IRepoResponse = await this.userservice.findOne({ data: { _id: item[i].userId } });
  
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