import { Router } from 'express';
import { CreateSellerUseCase } from '../../UseCases/3-seller-usecase/create.seller.usecase';
import { GetSellerUsecase } from '../../UseCases/3-seller-usecase/get.seller.usecase';
import { RandomSellersUsecase } from '../../UseCases/3-seller-usecase/random.seller.usecase';
import { SeedSellersUsecase } from '../../UseCases/3-seller-usecase/seed.seller.usecase';
import { UpdateSellerUsecase } from '../../UseCases/3-seller-usecase/update.seller.usercase';
import { CreateSeller } from '../Controllers/3-seller.controller.ts/create.seller.controller';
import { GetSellerById } from '../Controllers/3-seller.controller.ts/get-id.seller.controller';
import { RandomSeller } from '../Controllers/3-seller.controller.ts/get-random.seller.controller';
import { GetSellerByUsername } from '../Controllers/3-seller.controller.ts/get-username.seller.controller';
import { SeedSeller } from '../Controllers/3-seller.controller.ts/seed.seller.controller';
import { SellerId } from '../Controllers/3-seller.controller.ts/sellerId.seller.controller';
import { UpdateSeller } from '../Controllers/3-seller.controller.ts/update.seller.controller';
import { sellerSchema } from '../schemas/3-seller/seller.schema';

const sellerCreateInterceptor = new CreateSellerUseCase();
const sellerGetInterceptor = new GetSellerUsecase();
const sellerRandomInterceptor = new RandomSellersUsecase();
const sellerUpdateInterceptor = new UpdateSellerUsecase();

const sellerSeedInterceptor = new SeedSellersUsecase();

const createSellerController = new CreateSeller(sellerCreateInterceptor, sellerSchema);
const sellerGetByIdController = new GetSellerById(sellerGetInterceptor);
const sellerGetByUsernameController = new GetSellerByUsername(sellerGetInterceptor);
const sellerRandomSellersController = new RandomSeller(sellerRandomInterceptor);
const sellerUpdateController = new UpdateSeller(sellerUpdateInterceptor, sellerSchema);
const sellerSellerIdController = new SellerId(sellerGetInterceptor);
const seedSeller = new SeedSeller(sellerSeedInterceptor);

const SellerRouter = (router: Router): Router => {
  router.route('/create').post(createSellerController.handle.bind(createSellerController));
  router.route('/id').get(sellerGetByIdController.handle.bind(sellerGetByIdController));
  router.route('/username/:username').get(sellerGetByUsernameController.handle.bind(sellerGetByUsernameController));
  router.route('/random/:size').get(sellerRandomSellersController.handle.bind(sellerRandomSellersController));
  router.route('/update/:sellerId').put(sellerUpdateController.handle.bind(sellerUpdateController));
  router.route('/sellerId/:sellerId').get(sellerSellerIdController.handle.bind(sellerSellerIdController));
  router.route('/seed/:count').get(seedSeller.handle.bind(seedSeller));

  return router;
};

export default SellerRouter;
