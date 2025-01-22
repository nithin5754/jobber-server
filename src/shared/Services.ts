import config from "../config";
import { BuyerModal } from "../Infrastructure/Databse/Mongoose/Models/buyer.schema";
import { ConversationModel } from "../Infrastructure/Databse/Mongoose/Models/chat/conversation.schema";
import { MessageModel } from "../Infrastructure/Databse/Mongoose/Models/chat/message.schema";
import { GigModel } from "../Infrastructure/Databse/Mongoose/Models/gig.schema";
import { SellerModel } from "../Infrastructure/Databse/Mongoose/Models/seller.schema";
import { UserModal } from "../Infrastructure/Databse/Mongoose/Models/user.schema";
import { BuyerRepositories } from "../Infrastructure/Databse/Mongoose/Repositories/buyer.repository";
import { ChatRepository } from "../Infrastructure/Databse/Mongoose/Repositories/chat.repository";
import { GigRepository } from "../Infrastructure/Databse/Mongoose/Repositories/gig.repository";
import { Search } from "../Infrastructure/Databse/Mongoose/Repositories/search.gig.repository";
import { SellerRepository } from "../Infrastructure/Databse/Mongoose/Repositories/seller.respository";
import { UserRepository } from "../Infrastructure/Databse/Mongoose/Repositories/UserRespository";
import { UniqueId } from "../Infrastructure/External-libraries/1-unique-id/unique-id.service";
import { CloudinaryUploads } from "../Infrastructure/External-libraries/3-cloudinary/cloudinary-uploads.service";
import { Mailer } from "../Infrastructure/External-libraries/4-mailer/mailer.service";
import { MulterFileConverter } from "../Infrastructure/External-libraries/5-multer-converter/multer-convertor.service";
import { JwtToken } from "../Infrastructure/External-libraries/6-token.ts/token.service";

const services = {
  buyer:new BuyerRepositories(BuyerModal),
  user: new UserRepository(UserModal,new BuyerRepositories(BuyerModal)),
  seller:new SellerRepository(SellerModel),
  gig:new GigRepository(GigModel),
  cloudinary: new CloudinaryUploads(),
  uniqueId: new UniqueId(),
  multer: new MulterFileConverter(),
  mailer: new Mailer(),
  auth: new JwtToken(),
  configService:config,
  search:new Search(GigModel),
  messageRepository:new ChatRepository(MessageModel,ConversationModel)
  
};






export default services