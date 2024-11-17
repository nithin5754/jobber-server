import { Router } from 'express';
import upload from '../middlewares/multer';
import { RegisterUseCase } from '../../Application/use-cases/1-auth-usecase/register.usecase';
import { RegisterController } from '../Controllers/auth/register';
import { signupSchema } from '../schemas/1-auth-schemas/signup.schemas';
import services from '../../shared/Services';
import { LoginUseCase } from '../../Application/use-cases/1-auth-usecase/login.usecase';
import { Login as LoginController } from '../Controllers/auth/login';
import { loginSchema } from '../schemas/1-auth-schemas/signin.schema';
import { Refresh } from '../Controllers/auth/refresh';
import { RefreshUsecase } from '../../Application/use-cases/1-auth-usecase/refersh.usecase';
import { ForgotPassword } from '../Controllers/auth/forgotPassword';
import { ForgotPasswordUsecase } from '../../Application/use-cases/1-auth-usecase/forgotpassword.usecase';
import { forgotPasswordSchema, passwordSchema } from '../schemas/1-auth-schemas/passwordSchema';
import { ResetPasswordUsecase } from '../../Application/use-cases/1-auth-usecase/reset-password.usecase';
import { ResetPassword } from '../Controllers/auth/reset-password';
import { VerifyEmailUsecase } from '../../Application/use-cases/1-auth-usecase/verify-email.usecase';
import { VerifyEmail } from '../Controllers/auth/verify-email';
import { SignOut } from '../Controllers/auth/signout';

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
