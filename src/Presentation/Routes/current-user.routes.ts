

import { RequestHandler, Router } from 'express';

import { AuthService } from '../../Use Cases/1-auth-service/auth.service';
import { AuthRepository } from '../../frameworks/databse/mongoose/Repositories/AuthRepository';
import { Crypto } from '../../External-libraries/1-crypto/Crypto';
import { Uuid } from '../../External-libraries/2-public-id/Uuid';
import { CloudinaryUploads } from '../../External-libraries/3-cloudinary/Cloudinary-uploads';
import { Mailer } from '../../External-libraries/4-mailer/mailer';

import { MulterFileConverter } from '../../External-libraries/5-multer-converter/multer-converter';
import { JwtToken } from '../../External-libraries/6-token.ts/jwt.token';

import { CurrentUser } from '../Controllers/1-auth-controller/current-user';
import { verifyJWT } from '../middlewares/authMiddleware';

const authRepository = new AuthRepository();
const crypto = new Crypto();
const uuid = new Uuid();
const uploads = new CloudinaryUploads();
const multer = new MulterFileConverter();
const mailer = new Mailer();
const jwtToken = new JwtToken();
const authService = new AuthService(authRepository, jwtToken, crypto, uuid, uploads, mailer, multer);



const currentUserController=new CurrentUser(authService)




const CurrentRouter = (router: Router):Router => {
  router.use(verifyJWT as RequestHandler);
  router.route('/current-user').get(currentUserController.currentUser.bind(currentUserController))


  return router;
};

export default CurrentRouter;
