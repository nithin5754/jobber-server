
import {  Router } from 'express';

import { BuyerRepository } from '../../frameworks/databse/mongoose/Repositories/BuyerRepository';
import { BuyerService } from '../../Use Cases/2-user-service/buyer.service';
import { GetBuyer } from '../Controllers/2-user-controller/buyer/GetBuyer';





const buyerRepo=new BuyerRepository()
const buyerService=new BuyerService(buyerRepo)
const  onGetBuyer_controller=new GetBuyer(buyerService)

const BuyerRouter = (router: Router):Router => {
  router.route('/email').get(onGetBuyer_controller.onEmail.bind(onGetBuyer_controller))

  return router;
};

export default BuyerRouter;
