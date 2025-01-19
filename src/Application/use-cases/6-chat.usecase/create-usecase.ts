import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { io } from '../../..';
import { Message } from '../../../Domain/Entities/Chat';
import { IChatData } from '../../../Domain/interface/ichat.interface';
import { ChatRepository } from '../../../Infrastructure/databse/mongoose/Repositories/chat.repository';
import { UniqueId } from '../../../Infrastructure/External-libraries/1-unique-id/unique-id.service';
import { CloudinaryUploads } from '../../../Infrastructure/External-libraries/3-cloudinary/cloudinary-uploads.service';
import { MulterFileConverter } from '../../../Infrastructure/External-libraries/5-multer-converter/multer-convertor.service';
import { BadRequestError } from '../../../Presentation/error/error.interface';
import { IRepoResponse } from '../../../shared/IBase-repository';

import { IUseCase } from '../../../shared/IUsecase';

export interface ICreateMessageDTO {
  messageData: IChatData;
}

export interface ICreateMessageResult {
  message: Message;
}

export class CreateMessageUsecase implements IUseCase<ICreateMessageDTO, ICreateMessageResult> {
  constructor(
    private readonly messageService: ChatRepository,
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




    const response: IRepoResponse = await this.messageService.create({
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
