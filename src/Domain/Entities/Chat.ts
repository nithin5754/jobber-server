import { IMessageDocument } from '../interface/ichat.interface';
import { IOffer } from '../interface/iorder';


export class Message {
   id: string;
   conversationId: string;
   body: string;
   url: string;
   file: string;
   fileType: string;
   fileSize: string;
   fileName: string;
   gigId: string;
   sellerId: string;
   buyerId: string;
   senderUsername: string;
   senderPicture: string;
   receiverUsername: string;
   receiverPicture: string;
   isRead: boolean;
   hasOffer: boolean;
   offer: IOffer;
   hasConversationId: boolean;
   createdAt: Date;

  constructor(data:IMessageDocument) {
    this.id = data?._id.toString() as string
    this.conversationId = data.conversationId || '';
    this.body = data.body || '';
    this.url = data.url || '';
    this.file = data.file || '';
    this.fileType = data.fileType || '';
    this.fileSize = data.fileSize || '';
    this.fileName = data.fileName || '';
    this.gigId = data.gigId || '';
    this.sellerId = data.sellerId || '';
    this.buyerId = data.buyerId || '';
    this.senderUsername = data.senderUsername || '';
    this.senderPicture = data.senderPicture || '';
    this.receiverUsername = data.receiverUsername || '';
    this.receiverPicture = data.receiverPicture || '';
    this.isRead = data.isRead || false;
    this.hasOffer = data.hasOffer || false;
    this.offer = data.offer || ({} as IOffer);
    this.hasConversationId = data.hasConversationId || false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }
}
