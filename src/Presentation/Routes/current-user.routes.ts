import { Router } from 'express';
import { ResendUsecase } from '../../Application/UseCases/1AuthUsecase/resend.usecase';
import services from '../../Shared/Services';
import { Resend } from '../Controllers/1-user.controller/resend.user.controller';
import { CurrentUserUsecase } from '../../Application/UseCases/1AuthUsecase/currentUser.usecase';
import { CurrentUser } from '../Controllers/1-user.controller/current.user.controller';

const resendInterceptor = new ResendUsecase(services.user, services.mailer, services.configService, services.uniqueId);

const currentUserInterceptor = new CurrentUserUsecase(services.user);

const resendController = new Resend(resendInterceptor);

const currentUserController = new CurrentUser(currentUserInterceptor);

const CurrentRouter = (router: Router): Router => {
  router.route('/current-user').get(currentUserController.handle.bind(currentUserController));

  router.route('/resend-email').put(resendController.handle.bind(resendController));

  return router;
};

export default CurrentRouter;
