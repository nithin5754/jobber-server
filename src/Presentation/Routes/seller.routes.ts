import { Router } from 'express';

import { CreateSellerUseCase } from '../../Application/UseCases/3-seller-usecase/create.seller.usecase';
import { CreateSeller } from '../Controllers/3-seller.controller.ts/create.seller.controller';
import { sellerSchema } from '../Schemas/3-seller/seller.schema';
import services from '../../Shared/Services';
import { GetSellerUsecase } from '../../Application/UseCases/3-seller-usecase/get.seller.usecase';
import { GetSellerById } from '../Controllers/3-seller.controller.ts/get-id.seller.controller';
import { GetSellerByUsername } from '../Controllers/3-seller.controller.ts/get-username.seller.controller';
import { RandomSellersUsecase } from '../../Application/UseCases/3-seller-usecase/random.seller.usecase';
import { RandomSeller } from '../Controllers/3-seller.controller.ts/get-random.seller.controller';
import { UpdateSellerUsecase } from '../../Application/UseCases/3-seller-usecase/update.seller.usercase';
import { UpdateSeller } from '../Controllers/3-seller.controller.ts/update.seller.controller';
import { SellerId } from '../Controllers/3-seller.controller.ts/sellerId.seller.controller';
import { SeedSellersUsecase } from '../../Application/UseCases/3-seller-usecase/seed.seller.usecase';
import { SeedSeller } from '../Controllers/3-seller.controller.ts/seed.seller.controller';

const sellerCreateInterceptor = new CreateSellerUseCase(services.seller, services.buyer, services.user);
const sellerGetInterceptor = new GetSellerUsecase(services.seller, services.user);
const sellerRandomInterceptor = new RandomSellersUsecase(services.seller, services.user);
const sellerUpdateInterceptor = new UpdateSellerUsecase(services.seller, services.user);

const sellerSeedInterceptor=new SeedSellersUsecase(services.buyer,services.seller,services.user)



const createSellerController = new CreateSeller(sellerCreateInterceptor, sellerSchema);
const sellerGetByIdController = new GetSellerById(sellerGetInterceptor);
const sellerGetByUsernameController = new GetSellerByUsername(sellerGetInterceptor);
const sellerRandomSellersController = new RandomSeller(sellerRandomInterceptor);
const sellerUpdateController = new UpdateSeller(sellerUpdateInterceptor, sellerSchema);
const sellerSellerIdController = new SellerId(sellerGetInterceptor);
const seedSeller=new SeedSeller(sellerSeedInterceptor)

const SellerRouter = (router: Router): Router => {
  router.route('/create').post(createSellerController.handle.bind(createSellerController));
  router.route('/id').get(sellerGetByIdController.handle.bind(sellerGetByIdController));
  router.route('/username/:username').get(sellerGetByUsernameController.handle.bind(sellerGetByUsernameController));
  router.route('/random/:size').get(sellerRandomSellersController.handle.bind(sellerRandomSellersController));
  router.route('/update/:sellerId').put(sellerUpdateController.handle.bind(sellerUpdateController));
  router.route('/sellerId/:sellerId').get(sellerSellerIdController.handle.bind(sellerSellerIdController));
  router.route('/seed/:count').put(seedSeller.handle.bind(seedSeller));

  return router;
};

export default SellerRouter;
