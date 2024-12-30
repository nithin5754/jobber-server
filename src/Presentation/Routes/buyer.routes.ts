
import {  Router } from 'express';
import { GetBuyerUsecase } from '../../Application/use-cases/2-buyer-usecase/get-buyer.usecase';
import services from '../../shared/Services';
import { GetBuyerByEmail } from '../Controllers/2-buyer.controller/get.buyer.controller';



const getBuyerInterceptor=new GetBuyerUsecase(
  services.buyer
)



const getbuyerController=new GetBuyerByEmail(getBuyerInterceptor)


const BuyerRouter = (router: Router):Router => {
  router.route('/email').get(getbuyerController.handle.bind(getbuyerController))

  return router;
};

export default BuyerRouter;
