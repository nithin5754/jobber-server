import { Router } from 'express';
import services from '../../shared/services';

import { CreateGigUsecase } from '../../Application/use-cases/4-gig-usecase/create.gig.usecase';
import { CreateGig } from '../Controllers/4-gig.controller/create.gig.controller';
import { gigCreateSchema } from '../schemas/4-gig-schemas/gig.schemas';
import upload from '../middlewares/multer';
import { GetGig } from '../Controllers/4-gig.controller/get.gig.controller';
import { GetByIdSellerGig } from '../../Application/use-cases/4-gig-usecase/get-id.gig.usecase';
import { GetSellerGigs } from '../../Application/use-cases/4-gig-usecase/get-sellerId.gig.usecase';
import { GetSellerPausedGigs } from '../../Application/use-cases/4-gig-usecase/get-paused.gig.usecses';
import { DeleteGig } from '../Controllers/4-gig.controller/delete.gig.controller';
import { DeleteGigUsecase } from '../../Application/use-cases/4-gig-usecase/delete.gig.usecase';
import { SearchGigsUsecase } from '../../Application/use-cases/4-gig-usecase/search.gig.usecase';
import { GigSearchController } from '../Controllers/4-gig.controller/search.gig.controller';
import { GigSeedUsecases } from '../../Application/use-cases/4-gig-usecase/seed.gig.usecase';
import { GigSeedController } from '../Controllers/4-gig.controller/seed.controller';

const createGigInterceptor = new CreateGigUsecase(services.gig, services.uniqueId, services.multer, services.cloudinary, services.user);
const getByIdInterceptor = new GetByIdSellerGig(services.gig, services.user);
const getSellerGigsInterceptor = new GetSellerGigs(services.gig,services.user);
const getPauseGigsInterceptor = new GetSellerPausedGigs(services.gig);
const deleteGigInterceptor = new DeleteGigUsecase(services.gig);

const gigSearchInterceptor = new SearchGigsUsecase(services.search, services.user);

const gigSeedInterceptor = new GigSeedUsecases(services.gig, services.seller);

const createController = new CreateGig(createGigInterceptor, gigCreateSchema);
const getGigsController = new GetGig(getByIdInterceptor, getSellerGigsInterceptor, getPauseGigsInterceptor);
const deleteGigController = new DeleteGig(deleteGigInterceptor);
const searchGigController = new GigSearchController(gigSearchInterceptor);

const seedController = new GigSeedController(gigSeedInterceptor);

const GigRouter = (router: Router): Router => {
  router.route('/create-gig').post(upload.single('coverImage'), createController.handle.bind(createController));
  router.route('/gig-sellerId/:sellerId').get(getGigsController.sellerGigs.bind(getGigsController));

  router.route('/pause/:sellerId').get(getGigsController.sellerInactiveGigs.bind(getGigsController));

  router.route('/gigId/:gigId').get(getGigsController.gigById.bind(getGigsController));

  router.route('/search/gig/:page').get(searchGigController.handle.bind(searchGigController));

  router.route('/gig/seed').post(seedController.handle.bind(seedController));
  router.route(`/:gigId/:sellerId`).delete(deleteGigController.handle.bind(deleteGigController));
  return router;
};

export default GigRouter;
