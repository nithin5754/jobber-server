import { Router } from 'express';
import upload from '../Middlewares/multer';
import { RegisterUseCase } from '../../Application/use-cases/1-auth-usecase/register.usecase';
import { RegisterController } from '../Controllers/1-user.controller/register.user.controller';
import { signupSchema } from '../Schemas/1-auth-schemas/signup.schemas';

import { LoginUseCase } from '../../Application/use-cases/1-auth-usecase/login.usecase';
import { Login as LoginController } from '../Controllers/1-user.controller/login.user.controller';
import { loginSchema } from '../Schemas/1-auth-schemas/signin.schema';
import { Refresh } from '../Controllers/1-user.controller/refresh.user.controller';
import { RefreshUsecase } from '../../Application/use-cases/1-auth-usecase/refresh.usecase';
import { ForgotPassword } from '../Controllers/1-user.controller/forgot-password.user.controller';
import { ForgotPasswordUsecase } from '../../Application/use-cases/1-auth-usecase/forgot-password.usecase';
import { forgotPasswordSchema, passwordSchema } from '../Schemas/1-auth-schemas/passwordSchema';
import { ResetPasswordUsecase } from '../../Application/use-cases/1-auth-usecase/reset-password.usecase';
import { ResetPassword } from '../Controllers/1-user.controller/reset-password.user.controller';
import { VerifyEmailUsecase } from '../../Application/use-cases/1-auth-usecase/verify-email.usecase';
import { VerifyEmail } from '../Controllers/1-user.controller/verify-email.user.controller';
import { SignOut } from '../Controllers/1-user.controller/signout.user.controller';
import services from '../../Shared/Services';


/**
 * @description INTERCEPTORS
 */

const registerInterceptor = new RegisterUseCase(
  services.user,
  services.mailer,
  services.configService,
  services.uniqueId,
  services.multer,
  services.cloudinary,
  services.auth
);

const loginInterceptor = new LoginUseCase(services.user, services.auth);

const refreshInterceptor = new RefreshUsecase(services.auth, services.user);

const forgotPasswordInterceptor = new ForgotPasswordUsecase(services.user, services.configService, services.mailer, services.uniqueId);

const resetPasswordInterceptors = new ResetPasswordUsecase(services.user, services.auth);

const verifyEmailInterceptor = new VerifyEmailUsecase(services.user);

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
