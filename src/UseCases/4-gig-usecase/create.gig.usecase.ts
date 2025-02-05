import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { findOneGIG, countGig, createGIG } from "../../Database/Mongoose/Repositories/gig.repository";
import { findOneByUser } from "../../Database/Mongoose/Repositories/UserRespository";
import { SellerGig } from "../../Entities/Gig";
import { UniqueId } from "../../External-libraries/1-unique-id/unique-id.service";
import { CloudinaryUploads } from "../../External-libraries/3-cloudinary/cloudinary-uploads.service";
import { MulterFileConverter } from "../../External-libraries/5-multer-converter/multer-convertor.service";
import { IRepoResponse } from "../../IBaseRepositories";
import { ISellerGig } from "../../Interface/IGig.interface";
import { BadRequestError } from "../../Presentation/Error/errorInterface";


export interface ISellerGigCreateDTO {
  data: ISellerGig;
  coverImage: Express.Multer.File;
}

export interface ISellerGigCreateResult {
  sellerGig: SellerGig;
}

export class CreateGigUsecase  {
  constructor(

    private readonly uniqueIdService: UniqueId,
    private readonly multerService: MulterFileConverter,
    private readonly cloudinaryService: CloudinaryUploads,

  ) {}
  public async execute(input: ISellerGigCreateDTO): Promise<ISellerGigCreateResult> {
    const isFound: IRepoResponse = await findOneGIG({
      gig: {
        title: input.data.title
      }
    });

    if (isFound && isFound.gig) {
      throw new BadRequestError('Duplicate found', 'Seller Gig creation error');
    }

    const result: SellerGig = await this.processGigCreation(input);

    if (!result) {
      throw new BadRequestError('Failed to create gig', 'Seller Gig creation error');
    }

    await this.addUserDetails(result);

    return {
      sellerGig: result
    };
  }

  private async processGigCreation(input: ISellerGigCreateDTO): Promise<SellerGig> {
    const { coverImage, data } = input;

    const [_, { url }] = await Promise.all([this.generateRandomCharacters(), this.uploadPhotoGetUrlAndId(coverImage)]);

    const count = await countGig();

    const newGigData: ISellerGig = {
      ...data,
      sortId: count + 1,
      coverImage: url as string
    };

    const result: IRepoResponse = await createGIG({ gig: newGigData });

    if (!result || result.isNull || !result.gig) {
      throw new BadRequestError('Failed to create gig', 'Seller Gig creation error');
    }

    return result.gig;
  }

  private async generateRandomCharacters(): Promise<string> {
    const randomBytes: Buffer = await this.uniqueIdService.createRandomBytes();

    return randomBytes.toString('hex') as string;
  }

  private async uploadPhotoGetUrlAndId(coverImage: Express.Multer.File): Promise<{ url?: string; coverImageId?: string; error?: string }> {
    const coverImageId: string = this.uniqueIdService.createUuid();
    if (!coverImageId) {
      return { error: 'error creating profile public id' };
    }

    const dataURI: string = this.multerService.convertFileToString(coverImage) as string;
    const uploadResult: UploadApiResponse = (await this.uploadsPhotos(dataURI, `${coverImageId}`, true, true)) as UploadApiResponse;
    if (!uploadResult.public_id) {
      return { error: 'File upload error. Try again' };
    }

    return {
      url: uploadResult.url,
      coverImageId
    };
  }

  private async uploadsPhotos(
    file: string,
    public_id?: string,
    overWrite?: boolean,
    invalidate?: boolean
  ): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
    return this.cloudinaryService.uploads(file, public_id, overWrite, invalidate);
  }

  private async addUserDetails(gig: SellerGig): Promise<void> {
    const userDetails: IRepoResponse = await findOneByUser({ data: { _id: gig.userId } });

    if (!userDetails) {
      throw new BadRequestError('users not Found', `Get User Gig Usecase() Not Found by `);
    }

    gig.username = userDetails.user?.username;
    gig.profilePicture = userDetails.user?.profilePicture;
    gig.email = userDetails.user?.email;
  }
}
