import { Router } from 'express';

import { RegisterController } from '../Controllers/1-user.controller/register.user.controller';

import { Login as LoginController } from '../Controllers/1-user.controller/login.user.controller';


import { VerifyEmail } from '../Controllers/1-user.controller/verify-email.user.controller';
import { SignOut } from '../Controllers/1-user.controller/signout.user.controller';
import services from '../../Services';
import { ForgotPasswordUsecase } from '../../UseCases/1AuthUsecase/forgot-password.usecase';
import { LoginUseCase } from '../../UseCases/1AuthUsecase/login.usecase';
import { RefreshUsecase } from '../../UseCases/1AuthUsecase/refresh.usecase';
import { RegisterUseCase } from '../../UseCases/1AuthUsecase/register.usecase';
import { ResetPasswordUsecase } from '../../UseCases/1AuthUsecase/reset-password.usecase';
import { VerifyEmailUsecase } from '../../UseCases/1AuthUsecase/verify-email.usecase';
import { ForgotPassword } from '../Controllers/1-user.controller/forgot-password.user.controller';
import { Refresh } from '../Controllers/1-user.controller/refresh.user.controller';
import { ResetPassword } from '../Controllers/1-user.controller/reset-password.user.controller';

import { forgotPasswordSchema, passwordSchema } from '../schemas/1-auth-schemas/passwordSchema';
import { loginSchema } from '../schemas/1-auth-schemas/signin.schema';
import { signupSchema } from '../schemas/1-auth-schemas/signup.schemas';
import upload from '../middlewares/multer';

/**
 * @description INTERCEPTORS
 */

const registerInterceptor = new RegisterUseCase(
  services.mailer,
  services.configService,
  services.uniqueId,
  services.multer,
  services.cloudinary,
  services.auth
);

const loginInterceptor = new LoginUseCase( services.auth);

const refreshInterceptor = new RefreshUsecase(services.auth);

const forgotPasswordInterceptor = new ForgotPasswordUsecase( services.configService, services.mailer, services.uniqueId);

const resetPasswordInterceptors = new ResetPasswordUsecase( services.auth);

const verifyEmailInterceptor = new VerifyEmailUsecase();

/**
 * @description CONTROLLERS
 */

const registerController = new RegisterController(registerInterceptor, signupSchema);

const loginController = new LoginController(loginInterceptor, loginSchema);

const refreshController = new Refresh(refreshInterceptor);

const forgotPasswordController = new ForgotPassword(forgotPasswordSchema, forgotPasswordInterceptor);

const resetPasswordController = new ResetPassword(passwordSchema, resetPasswordInterceptors);

const verifyEmailController = new VerifyEmail(verifyEmailInterceptor);

const signOutController = new SignOut();

const authRouter = (router: Router) => {
  router.route('/register').post(upload.single('profilePicture'), registerController.handle.bind(registerController));
  router.route('/login').post(upload.none(), loginController.handle.bind(loginController));
  router.route('/refresh').get(refreshController.handle.bind(refreshController));
  router.route('/forgot-password').post(forgotPasswordController.handle.bind(forgotPasswordController));

  router.route('/reset-password/:token').put(resetPasswordController.handle.bind(resetPasswordController));

  router.route('/verify-email').put(verifyEmailController.handle.bind(verifyEmailController));

  router.route('/signout').post(signOutController.handle.bind(signOutController));

  return router;
};

export default authRouter;
