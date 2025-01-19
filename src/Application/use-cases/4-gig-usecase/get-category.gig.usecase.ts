


import { SellerGig } from "../../../Domain/Entities/gig.entity";
import { GigRepository } from "../../../Infrastructure/databse/mongoose/Repositories/gig.repository";
import { UserRepository } from "../../../Infrastructure/databse/mongoose/Repositories/user.respository";
import { BadRequestError } from "../../../Presentation/error/error.interface";
import { firstLetterUpperCase } from "../../../Presentation/utils/helper.utils";
import { IRepoResponse } from "../../../shared/IBase-repository";
import { IUseCase } from "../../../shared/IUsecase";




export interface ISellerGigGetByCategoryDTO {
  category: string;

}

export interface ISellerGigGetByCategoryResult {
  gigs:SellerGig[]
}

export class GetByCategorySellerGig implements IUseCase<ISellerGigGetByCategoryDTO, ISellerGigGetByCategoryResult> {
  constructor(private readonly gigService: GigRepository,
    private readonly userservice:UserRepository
  ) {}
  public async execute(input: ISellerGigGetByCategoryDTO): Promise<ISellerGigGetByCategoryResult> {
    
    const found:IRepoResponse=await this.gigService.findByLimit({
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