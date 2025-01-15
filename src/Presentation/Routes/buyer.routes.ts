
import {  Router } from 'express';
import { GetBuyerUsecase } from '../../Application/use-cases/2-buyer-usecase/get-buyer.usecase';
import services from '../../shared/Services';
import { GetBuyerByEmail } from '../Controllers/2-buyer.controller/get.buyer.controller';
import { GetBuyerByUsername } from '../Controllers/2-buyer.controller/get_username.buyser.controller';



const getBuyerInterceptor=new GetBuyerUsecase(
  services.buyer
)



const getbuyerController=new GetBuyerByEmail(getBuyerInterceptor)
const getUsernameByBuyerController=new GetBuyerByUsername(getBuyerInterceptor)

const BuyerRouter = (router: Router):Router => {
  router.route('/email').get(getbuyerController.handle.bind(getbuyerController))
  router.route('/username/:username').get(getUsernameByBuyerController.handle.bind(getUsernameByBuyerController))
  return router;
};

export default BuyerRouter;
