import { updateMultipleChat } from "../../../Infrastructure/Database/Mongoose/Repositories/chat.repository";




export interface IMarkMultipleMessageDTO {
  messageId: string;
  senderUsername: string;
  receiverUsername: string;
}



export class MarkMultipleMessageAsReadUsecase  {

  public async execute(input: IMarkMultipleMessageDTO): Promise<void> {
   await updateMultipleChat({
      updateFilterMultipleMessage: {
        _id: input.messageId,
        receiverUsername: input.receiverUsername,
        senderUsername: input.senderUsername
      },
      updateMessage: { isRead: true }
    });


   
  }
}
