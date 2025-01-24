import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { createChat } from '../../Database/Mongoose/Repositories/chat.repository';
import { Message } from '../../Entities/Chat';
import { UniqueId } from '../../External-libraries/1-unique-id/unique-id.service';
import { CloudinaryUploads } from '../../External-libraries/3-cloudinary/cloudinary-uploads.service';
import { IRepoResponse } from '../../IBaseRepositories';
import { IChatData } from '../../Interface/IChat.interface';
import { io } from '../../main';
import { BadRequestError } from '../../Presentation/Error/errorInterface';



export interface ICreateMessageDTO {
  messageData: IChatData;
}

export interface ICreateMessageResult {
  message: Message;
}

export class CreateMessageUsecase  {
  constructor(
    private readonly uniqueIdService: UniqueId,
    private readonly cloudinaryService: CloudinaryUploads
  ) {}
  public async execute(input: ICreateMessageDTO): Promise<ICreateMessageResult> {

    let messageData:IChatData=input.messageData;

    if(input.messageData.file){
      const url = await this.uploadFileAndId(`${input.messageData.file}`);
      if(url.url){
        messageData.file=url.url as string
      }
    }




    const response: IRepoResponse = await createChat({
      message: messageData
    });





    if (!response?.MessageDetails) {
      throw new BadRequestError('Failed to save message', 'CreateMessageUseCase: Message creation failed');
    }

    io.emit('message received', { message: response.MessageDetails ?? {} });
    return {
      message: response.MessageDetails as Message
    };
  }

  private async generateRandomCharacters(): Promise<string> {
    const randomBytes: Buffer = await this.uniqueIdService.createRandomBytes();

    return randomBytes.toString('hex') as string;
  }

  private async uploadFileAndId(file: string): Promise<{ url?: string }> {
    const randomCharacters: string = await this.generateRandomCharacters();
    const uploadResult: UploadApiResponse = (await this.uploadsPhotos(file, `${randomCharacters}`, true, true)) as UploadApiResponse;

    if (!uploadResult.url) {
      throw new BadRequestError('Error uploading', 'UploadApiResponse() Missing');
    }
    return {
      url: uploadResult.url
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
}
