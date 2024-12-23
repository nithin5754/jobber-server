
import { SellerGig } from '../../../Domain/Entities/gig.entity';
import { ISellerGig } from '../../../Domain/interface/igig.interface';
import { GigRepository } from '../../../Infrastructure/databse/mongoose/Repositories/gig.repository';
import { UserRepository } from '../../../Infrastructure/databse/mongoose/Repositories/user.respository';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/ibase-repository';
import { IUseCase } from '../../../shared/iusecase';



export interface ISellerGigUpdateDTO {
  id: string;
  data: ISellerGig;
  coverImage?: Express.Multer.File;
}

export interface ISellerGigUpdateResult {
 gig:SellerGig
}

export class UpdateGigUsecase implements IUseCase<ISellerGigUpdateDTO, ISellerGigUpdateResult> {
  constructor(
    private readonly gigService: GigRepository,
    private readonly userService:UserRepository
  ) {}
  public async execute(input: ISellerGigUpdateDTO): Promise<ISellerGigUpdateResult> {

const result:SellerGig=await this.processGigUpdate(input);


   return {
gig:result
   }
  }

  private async processGigUpdate(input: ISellerGigUpdateDTO): Promise<SellerGig> {
    const { data, id } = input;



      const result:IRepoResponse=   await this.gigService.update(id, { gig: data });

      if(!result||!result.gig){
        throw new BadRequestError('users not Found ', `Editing UpdateGigUsecase() Not Found by `);

      }

     await this.addUserDetails(result.gig)

     return result.gig

  }


  private async addUserDetails(gig: SellerGig): Promise<void> {
    const userDetails: IRepoResponse = await this.userService.findOne({ data: { _id: gig.userId } });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `Get User Gig Usecase() Not Found by `);
    }

    gig.username = userDetails.user?.username;
    gig.profilePicture = userDetails.user?.profilePicture;
    gig.email = userDetails.user?.email;
  }
}
