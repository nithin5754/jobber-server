
import config from "./config";
import { UniqueId } from "./External-libraries/1-unique-id/unique-id.service";
import { CloudinaryUploads } from "./External-libraries/3-cloudinary/cloudinary-uploads.service";
import { Mailer } from "./External-libraries/4-mailer/mailer.service";
import { MulterFileConverter } from "./External-libraries/5-multer-converter/multer-convertor.service";
import { JwtToken } from "./External-libraries/6-token.ts/token.service";


const services = {

  cloudinary: new CloudinaryUploads(),
  uniqueId: new UniqueId(),
  multer: new MulterFileConverter(),
  mailer: new Mailer(),
  auth: new JwtToken(),
  configService:config,

  
};






export default services