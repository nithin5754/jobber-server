import { Model } from "mongoose";
import { Message } from "../../../../Domain/Entities/Chat";
import {  IConversation, IConversationDocument, IMessageDocument } from "../../../../Domain/Interface/IChat.interface";
import { IChatRepositories } from "../../../../Domain/Interface/IChat.repository";
import { IRepoRequest, IRepoResponse } from "../../../../Shared/IBaseRepository";







export class ChatRepository implements IChatRepositories {


constructor(

  private readonly MessageModel:Model<IMessageDocument>,
  private readonly ConversationModel:Model<IConversationDocument>
){

}

public async updateOffer  (messageId: string, type: string): Promise<IRepoResponse> {
  const message: IMessageDocument = await this.MessageModel.findOneAndUpdate(
    { _id: messageId },
    {
      $set: {
        [`offer.${type}`]: true
      }
    },
    { new: true }
  ) as IMessageDocument;
  return {
    MessageDetails:this.convertMessage(message)
  }
};



  public async createConversation(data: IRepoRequest):  Promise<void> {
await this.ConversationModel.create(
      {
        conversationId:data.message?.conversationId,
        senderUsername:data.message?.senderUsername,
        receiverUsername:data.message?.receiverUsername
      }
    );

    }


 public async create(data: IRepoRequest): Promise<IRepoResponse> {

  const message: IMessageDocument = await this.MessageModel.create(data.message) as IMessageDocument;
  return {
    MessageDetails:this.convertMessage(message)||null 
  }

}


  public async getConversation(sender: string, receiver: string):Promise<IRepoResponse>{
    const query = {
      $or: [
        { senderUsername: sender, receiverUsername: receiver },
        { senderUsername: receiver, receiverUsername: sender },
      ]
    };
    const conversation: IConversationDocument[] = await this.ConversationModel.aggregate([{ $match: query }]);

    return {
      conversationDetailsArray:this.convertConversationArray(conversation)??[]
    }
  }

 public async  getUserConversationList (data:IRepoRequest): Promise<IRepoResponse>  {
    const query = {
      $or: [
        { senderUsername: data.filter?.username as string},
        { receiverUsername: data.filter?.username as string },
      ]
    };
    const messages: IMessageDocument[] = await this.MessageModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$conversationId',
          result: { $top: { output: '$$ROOT', sortBy: { createdAt: -1 }}}
        }
      },
      {
        $project: {
          _id: '$result._id',
          conversationId: '$result.conversationId',
          sellerId: '$result.sellerId',
          buyerId: '$result.buyerId',
          receiverUsername: '$result.receiverUsername',
          receiverPicture: '$result.receiverPicture',
          senderUsername: '$result.senderUsername',
          senderPicture: '$result.senderPicture',
          body: '$result.body',
          file: '$result.file',
          gigId: '$result.gigId',
          isRead: '$result.isRead',
          hasOffer: '$result.hasOffer',
          createdAt: '$result.createdAt'
        }
      }
    ]);


    return {
   messageDetailsArray:this.convertMessageArray(messages)??[]
    };
  };

  public async getMessages  (sender: string, receiver: string): Promise<IRepoResponse>  {
    const query = {
      $or: [
        { senderUsername: sender, receiverUsername: receiver },
        { senderUsername: receiver, receiverUsername: sender },
      ]
    };
    const messages: IMessageDocument[] = await this.MessageModel.aggregate([
      { $match: query },
      { $sort: { createdAt: 1 }}
    ]);
    return {
      messageDetailsArray:this.convertMessageArray(messages)??[]
    }
  };
  findOne(_criteria: IRepoRequest): Promise<IRepoResponse> {
    throw new Error("Method not implemented.");
  }
 public async update(id: string, data: IRepoRequest): Promise<IRepoResponse> {
    const message: IMessageDocument = await this.MessageModel.findOneAndUpdate(
      { _id: id },
      {
        $set: data.updateMessage
      },
      { new: true }
    ) as IMessageDocument;

   
 return {
  MessageDetails:this.convertMessage(message)??undefined
 }

  }

  public async getUserMessages  (messageConversationId: string): Promise<IRepoResponse>  {
    const messages: IMessageDocument[] = await this.MessageModel.aggregate([
      { $match: { conversationId: messageConversationId } },
      { $sort: { createdAt: 1 }}
    ]);
    return {
      messageDetailsArray:this.convertMessageArray(messages)
    }
  };
  


  public async updateMultiple(data: IRepoRequest): Promise<void> {
    await this.MessageModel.updateMany(
      { ...data.updateFilterMultipleMessage },
      { $set: data.updateMessage }
  )

  }

  delete(_id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }


  convertMessage(data:IMessageDocument):Message{
    return new Message(data)
  }

  convertMessageArray(data:IMessageDocument[]):Message[]{
    let messageArray:Message[]=[]
    for (let i = 0; i < data.length; i++) {
      messageArray.push(new Message(data[i]) )
      
    }

    return messageArray
  }


  convertConversation(data:IConversationDocument):IConversation{

    return {
      conversationId:data.conversationId,
      id:data._id.toString() as string,
      receiverUsername:data.receiverUsername,
      senderUsername:data.senderUsername
    }
  }


  convertConversationArray(data:IConversationDocument[]):IConversation[]{
let conversationData:IConversation[]=[]
    for (let i = 0; i < data.length; i++) {
      
let conversation:IConversation=this.convertConversation(data[i])

  if(conversation){
    conversationData.push(conversation)
  }
      
    }

    return conversationData
  }

}