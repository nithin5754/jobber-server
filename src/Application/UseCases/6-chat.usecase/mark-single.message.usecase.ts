import { updateChat } from "../../../Infrastructure/Database/Mongoose/Repositories/chat.repository";





export interface IMarkSingleMessageDTO {
  id: string;
}


export class MarkMessageAsReadUsecase  {

  public async execute(input: IMarkSingleMessageDTO): Promise<void> {

await updateChat(input.id, { updateMessage: { isRead: true } });



   
  }


}

