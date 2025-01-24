import { Router } from 'express';

import { CurrentUser } from '../Controllers/1-user.controller/current-user';
import services from '../../Services';
import { CurrentUserUsecase } from '../../UseCases/1AuthUsecase/currentUser.usecase';
import { ResendUsecase } from '../../UseCases/1AuthUsecase/resend.usecase';
import { Resend } from '../Controllers/1-user.controller/resend.user.controller';

const resendInterceptor = new ResendUsecase( services.mailer, services.configService, services.uniqueId);

const currentUserInterceptor = new CurrentUserUsecase();

const resendController = new Resend(resendInterceptor);

const currentUserController = new CurrentUser(currentUserInterceptor);

const CurrentRouter = (router: Router): Router => {
  router.route('/current-user').get(currentUserController.handle.bind(currentUserController));

  router.route('/resend-email').put(resendController.handle.bind(resendController));

  return router;
};

export default CurrentRouter;
