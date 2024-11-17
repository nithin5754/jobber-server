import { Router } from "express";
import { ResendUsecase } from "../../Application/use-cases/1-auth-usecase/resend.usecase";
import services from "../../shared/Services";
import { Resend } from "../Controllers/auth/resend";




const resendInterceptor=new ResendUsecase(
  services.user,
  services.mailer,
  services.configService,
  services.uniqueId
)




const resendController=new Resend(resendInterceptor)





const CurrentRouter = (router: Router):Router => {

  router.route('/resend-email').put(resendController.handle.bind(resendController))


  return router;
};

export default CurrentRouter;
