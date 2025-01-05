import config from "../config";
import { BuyerModal } from "../Infrastructure/databse/mongoose/models/buyer.schema";
import { ConversationModel } from "../Infrastructure/databse/mongoose/models/chat/conversation.schema";
import { MessageModel } from "../Infrastructure/databse/mongoose/models/chat/message.schema";
import { GigModel } from "../Infrastructure/databse/mongoose/models/gig.schema";
import { SellerModel } from "../Infrastructure/databse/mongoose/models/seller.schema";
import { UserModal } from "../Infrastructure/databse/mongoose/models/user.schema";
import { BuyerRepositories } from "../Infrastructure/databse/mongoose/Repositories/buyer.repository";
import { ChatRepository } from "../Infrastructure/databse/mongoose/Repositories/chat.repository";
import { GigRepository } from "../Infrastructure/databse/mongoose/Repositories/gig.repository";
import { Search } from "../Infrastructure/databse/mongoose/Repositories/search.gig.repository";
import { SellerRepository } from "../Infrastructure/databse/mongoose/Repositories/seller.respository";
import { UserRepository } from "../Infrastructure/databse/mongoose/Repositories/user.respository";
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