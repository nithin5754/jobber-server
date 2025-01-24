import { Message } from '../../../../Entities/Chat';
import { IConversation, IConversationDocument, IMessageDocument } from '../../../../Interface/IChat.interface';

import { IRepoResponse, IRepoRequest } from '../../../../IBaseRepositories';
import { MessageModel } from '../Models/chat/message.schema';
import { ConversationModel } from '../Models/chat/conversation.schema';

export async function updateOfferChat(messageId: string, type: string): Promise<IRepoResponse> {
  const message: IMessageDocument = (await MessageModel.findOneAndUpdate(
    { _id: messageId },
    {
      $set: {
        [`offer.${type}`]: true
      }
    },
    { new: true }
  )) as IMessageDocument;
  return {
    MessageDetails: convertMessage(message)
  };
}

export async function createConversationChat(data: IRepoRequest): Promise<void> {
  await ConversationModel.create({
    conversationId: data.message?.conversationId,
    senderUsername: data.message?.senderUsername,
    receiverUsername: data.message?.receiverUsername
  });
}

export async function createChat(data: IRepoRequest): Promise<IRepoResponse> {
  const message: IMessageDocument = (await MessageModel.create(data.message)) as IMessageDocument;
  return {
    MessageDetails: convertMessage(message) || null
  };
}

export async function getConversationChat(sender: string, receiver: string): Promise<IRepoResponse> {
  const query = {
    $or: [
      { senderUsername: sender, receiverUsername: receiver },
      { senderUsername: receiver, receiverUsername: sender }
    ]
  };
  const conversation: IConversationDocument[] = await ConversationModel.aggregate([{ $match: query }]);

  return {
    conversationDetailsArray: convertConversationArray(conversation) ?? []
  };
}

export async function getUserConversationListChat(data: IRepoRequest): Promise<IRepoResponse> {
  const query = {
    $or: [{ senderUsername: data.filter?.username as string }, { receiverUsername: data.filter?.username as string }]
  };
  const messages: IMessageDocument[] = await MessageModel.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$conversationId',
        result: { $top: { output: '$$ROOT', sortBy: { createdAt: -1 } } }
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
    messageDetailsArray: convertMessageArray(messages) ?? []
  };
}

export async function getMessagesChat(sender: string, receiver: string): Promise<IRepoResponse> {
  const query = {
    $or: [
      { senderUsername: sender, receiverUsername: receiver },
      { senderUsername: receiver, receiverUsername: sender }
    ]
  };
  const messages: IMessageDocument[] = await MessageModel.aggregate([{ $match: query }, { $sort: { createdAt: 1 } }]);
  return {
    messageDetailsArray: convertMessageArray(messages) ?? []
  };
}

export async function updateChat(id: string, data: IRepoRequest): Promise<IRepoResponse> {
  const message: IMessageDocument = (await MessageModel.findOneAndUpdate(
    { _id: id },
    {
      $set: data.updateMessage
    },
    { new: true }
  )) as IMessageDocument;

  return {
    MessageDetails: convertMessage(message) ?? undefined
  };
}

export async function getUserMessagesChat(messageConversationId: string): Promise<IRepoResponse> {
  const messages: IMessageDocument[] = await MessageModel.aggregate([
    { $match: { conversationId: messageConversationId } },
    { $sort: { createdAt: 1 } }
  ]);
  return {
    messageDetailsArray: convertMessageArray(messages)
  };
}

export async function updateMultipleChat(data: IRepoRequest): Promise<void> {
  await MessageModel.updateMany({ ...data.updateFilterMultipleMessage }, { $set: data.updateMessage });
}

function convertMessage(data: IMessageDocument): Message {
  return new Message(data);
}

function convertMessageArray(data: IMessageDocument[]): Message[] {
  let messageArray: Message[] = [];
  for (let i = 0; i < data.length; i++) {
    messageArray.push(new Message(data[i]));
  }

  return messageArray;
}

function convertConversation(data: IConversationDocument): IConversation {
  return {
    conversationId: data.conversationId,
    id: data._id.toString() as string,
    receiverUsername: data.receiverUsername,
    senderUsername: data.senderUsername
  };
}

function convertConversationArray(data: IConversationDocument[]): IConversation[] {
  let conversationData: IConversation[] = [];
  for (let i = 0; i < data.length; i++) {
    let conversation: IConversation = convertConversation(data[i]);

    if (conversation) {
      conversationData.push(conversation);
    }
  }

  return conversationData;
}
