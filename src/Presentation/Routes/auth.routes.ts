import { Router } from 'express';
import { SignUp } from '../Controllers/1-auth-controller/signup';
import { AuthService } from '../../Use Cases/1-auth-service/auth.service';
import { AuthRepository } from '../../frameworks/databse/mongoose/Repositories/AuthRepository';
import { Crypto } from '../../External-libraries/1-crypto/Crypto';
import { Uuid } from '../../External-libraries/2-public-id/Uuid';
import { CloudinaryUploads } from '../../External-libraries/3-cloudinary/Cloudinary-uploads';
import { Mailer } from '../../External-libraries/4-mailer/mailer';
import upload from '../middlewares/multer';
import { MulterFileConverter } from '../../External-libraries/5-multer-converter/multer-converter';
import { JwtToken } from '../../External-libraries/6-token.ts/jwt.token';
import { SignIn } from '../Controllers/1-auth-controller/signin';
import { VerifyEmail } from '../Controllers/1-auth-controller/verify-email';
import { ForgotPassword } from '../Controllers/1-auth-controller/forgotPassword';

const authRepository = new AuthRepository();
const crypto = new Crypto();
const uuid = new Uuid();
const uploads = new CloudinaryUploads();
const multer = new MulterFileConverter();
const mailer = new Mailer();
const jwtToken = new JwtToken();
const authService = new AuthService(authRepository, jwtToken, crypto, uuid, uploads, mailer, multer);

const signup_controller = new SignUp(authService);

const signin_controller = new SignIn(authService);

const verify_controller = new VerifyEmail(authService);
const forgot_Password_Controller = new ForgotPassword(authService);
const authRouter = (router: Router) => {
  router.route('/register').post(upload.single('profilePicture'), signup_controller.onCreateUser.bind(signup_controller));
  router.route('/login').post(upload.none(), signin_controller.read.bind(signin_controller));

  router.route('/verify-email').put(verify_controller.update.bind(verify_controller));
  router.route('/forgot-password').post(forgot_Password_Controller.forgotPassword.bind(forgot_Password_Controller));

  router.route('/reset-password/:token').put(forgot_Password_Controller.resetPassword.bind(forgot_Password_Controller));

  return router;
};

export default authRouter;
