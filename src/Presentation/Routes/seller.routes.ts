import { Router } from 'express';

import { CreateSellerUseCase } from '../../Application/use-cases/3-seller-usecase/create.seller.usecase';
import { CreateSeller } from '../Controllers/3-seller.controller.ts/create.seller.controller';
import { sellerSchema } from '../schemas/3-seller/seller.schema';
import services from '../../shared/services';
import { GetSellerUsecase } from '../../Application/use-cases/3-seller-usecase/get.seller.usecase';
import { GetSellerById } from '../Controllers/3-seller.controller.ts/get-id.seller.controller';
import { GetSellerByUsername } from '../Controllers/3-seller.controller.ts/get-username.seller.controller';
import { RandomSellersUsecase } from '../../Application/use-cases/3-seller-usecase/random.usecase';
import { RandomSeller } from '../Controllers/3-seller.controller.ts/get-random.seller.controller';

const sellerCreateInterceptor = new CreateSellerUseCase(services.seller,services.buyer,services.user);
const sellerGetInterceptor = new GetSellerUsecase(services.seller,services.user);
const sellerRandomInterceptor = new RandomSellersUsecase(services.seller,services.user);

const createSellerController = new CreateSeller(sellerCreateInterceptor, sellerSchema);
const sellerGetByIdController = new GetSellerById(sellerGetInterceptor);
const sellerGetByUsernameController = new GetSellerByUsername(sellerGetInterceptor);
const sellerRandomSellersController = new RandomSeller(sellerRandomInterceptor);

const SellerRouter = (router: Router): Router => {
  router.route('/create').post(createSellerController.handle.bind(createSellerController));
  router.route('/id/:sellerId').get(sellerGetByIdController.handle.bind(sellerGetByIdController));
  router.route('/username/:username').get(sellerGetByUsernameController.handle.bind(sellerGetByUsernameController));
  router.route('/random/:size').get(sellerRandomSellersController.handle.bind(sellerRandomSellersController));

  router.route('/update/:sellerId').put();

  return router;
};

export default SellerRouter;
