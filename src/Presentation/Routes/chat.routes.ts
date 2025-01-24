import { Router } from 'express';
import { CreateMessageUsecase } from '../../Application/UseCases/6-chat.usecase/create-usecase';
import services from '../../Services';
import { CreateMessage } from '../Controllers/5-chat.controller/create.chat';
import { GetMessageUsecase } from '../../Application/UseCases/6-chat.usecase/get-message.usecase';
import { GetConversationUsecase } from '../../Application/UseCases/6-chat.usecase/get-conversation';
import { Messages } from '../Controllers/5-chat.controller/message.chat';
import { Conversation } from '../Controllers/5-chat.controller/conversation.chat';
import { CreateConversationUsecase } from '../../Application/UseCases/6-chat.usecase/create-conversation';
import { ConversationListUsecase } from '../../Application/UseCases/6-chat.usecase/conversation-list.usecase';
import { ConversationList } from '../Controllers/5-chat.controller/conversationList.chat';
import { MarkMessageAsReadUsecase } from '../../Application/UseCases/6-chat.usecase/mark-single.message.usecase';
import { MarkSingleMessage } from '../Controllers/5-chat.controller/mark-single-message';
import { MarkMultipleMessageAsReadUsecase } from '../../Application/UseCases/6-chat.usecase/mark-multiple.message.usecase';
import { MarkMultipleMessage } from '../Controllers/5-chat.controller/mark-multiple-message.chat';
import { GetUserMessagesUsecase } from '../../Application/UseCases/6-chat.usecase/get-usermessages.uecase';
import { UserMessages } from '../Controllers/5-chat.controller/userMessages.chat';
import { UpdateOfferReadUsecase } from '../../Application/UseCases/6-chat.usecase/update.offer.usecase';
import { UpdateOfferMessages } from '../Controllers/5-chat.controller/update.chat';



//INTERCEPTORS

const createInterceptor = new CreateMessageUsecase(services.uniqueId, services.cloudinary,);
const getMessageInterceptor = new GetMessageUsecase();
const getConversationInterceptor = new GetConversationUsecase();
const conversationListInterceptor = new ConversationListUsecase();
const multipleMarkInterceptor=new MarkMultipleMessageAsReadUsecase()
const createConversationInterceptor = new CreateConversationUsecase();
const markMessageInterceptor = new MarkMessageAsReadUsecase()
const getUserMessagesInterceptors=new GetUserMessagesUsecase()

const updateOfferInterceptor=new UpdateOfferReadUsecase()

//CONTROLLERS

const messageController = new CreateMessage(createInterceptor, createConversationInterceptor);
const messages = new Messages(getMessageInterceptor);
const conversation = new Conversation(getConversationInterceptor);
const markSingleMsg = new MarkSingleMessage(markMessageInterceptor);
const conversationList = new ConversationList(conversationListInterceptor);
const multipleMark=new MarkMultipleMessage(multipleMarkInterceptor)
const userMessages=new UserMessages(getUserMessagesInterceptors)
const updateOffer=new UpdateOfferMessages(updateOfferInterceptor)

const ChatRouter = (router: Router): Router => {
  router.route('/').post(messageController.handle.bind(messageController)); 
  router.route('/conversation/:senderUsername/:receiverUsername').get(conversation.handle.bind(conversation));
  router.route('/:senderUsername/:receiverUsername').get(messages.handle.bind(messages)); 
  router.route('/conversations/list/:username').get(conversationList.handle.bind(conversationList)); 
  router.route('/mark-multiple-as-read').put(multipleMark.handle.bind(multipleMark))
  router.route('/mark-as-read').put(markSingleMsg.handle.bind(markSingleMsg));
router.route('/offer').put(updateOffer.handle.bind(updateOffer))
  router.route('/messages/chat-user-messages/:conversationId').get(userMessages.handle.bind(userMessages))
  return router;
};
export default ChatRouter;
