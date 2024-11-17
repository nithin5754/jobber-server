import config from "../config";
import { UserModal } from "../Infrastructure/databse/mongoose/models/user.schema";
import { UserRepository } from "../Infrastructure/databse/mongoose/Repositories/UserRepository";
import { UniqueId } from "../Infrastructure/External-libraries/1-unique-id/UniqueId";
import { CloudinaryUploads } from "../Infrastructure/External-libraries/3-cloudinary/Cloudinary-uploads";
import { Mailer } from "../Infrastructure/External-libraries/4-mailer/mailer";
import { MulterFileConverter } from "../Infrastructure/External-libraries/5-multer-converter/multer-converter";
import { JwtToken } from "../Infrastructure/External-libraries/6-token.ts/jwt.token";

const services = {
  user: new UserRepository(UserModal),
  cloudinary: new CloudinaryUploads(),
  uniqueId: new UniqueId(),
  multer: new MulterFileConverter(),
  mailer: new Mailer(),
  auth: new JwtToken(),
  configService:config
};

export default services