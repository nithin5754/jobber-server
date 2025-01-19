import { SellerGig } from "../../../Domain/Entities/gig.entity";
import { GigRepository } from "../../../Infrastructure/databse/mongoose/Repositories/gig.repository";
import { UserRepository } from "../../../Infrastructure/databse/mongoose/Repositories/user.respository";
import { BadRequestError } from "../../../Presentation/error/error.interface";
import { IRepoResponse } from "../../../shared/IBase-repository";
import { IUseCase } from "../../../shared/IUsecase";




export interface ISellerGigGetByIdDTO {
  gigId: string;

}

export interface ISellerGigGetByIdResult {
  gig:SellerGig
}

export class GetByIdSellerGig implements IUseCase<ISellerGigGetByIdDTO, ISellerGigGetByIdResult> {
  constructor(private readonly gigService: GigRepository,
    private readonly userservice:UserRepository
  ) {}
  public async execute(input: ISellerGigGetByIdDTO): Promise<ISellerGigGetByIdResult> {
    
    const found:IRepoResponse=await this.gigService.findOne({
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
    const userDetails: IRepoResponse = await this.userservice.findOne({ data: { _id: gig.userId} });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `Get User Gig Usecase() Not Found by `);
    }

    gig.username = userDetails.user?.username;
    gig.profilePicture = userDetails.user?.profilePicture;
    gig.email = userDetails.user?.email;
  }



}