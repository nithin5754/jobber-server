import { Router } from 'express';
import services from '../../shared/Services';

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
import { SearchGigsUsecase } from '../../Application/use-cases/5-search-usecase/search.gig.usecase';
import { GigSearchController } from '../Controllers/4-gig.controller/search.gig.controller';
import { GigSeedUsecases } from '../../Application/use-cases/4-gig-usecase/seed.gig.usecase';
import { GigSeedController } from '../Controllers/4-gig.controller/seed.controller';
import { MoreLikeThisUsecase } from '../../Application/use-cases/4-gig-usecase/get-MoreGigsLikeThis';
import { GetByCategorySellerGig } from '../../Application/use-cases/4-gig-usecase/get-category.gig.usecase';
import { UpdateGigUsecase } from '../../Application/use-cases/4-gig-usecase/updata.gig.usecase';
import { UpdateGig } from '../Controllers/4-gig.controller/update.gig.controller';
import { updateActiveGigUsecase } from '../../Application/use-cases/4-gig-usecase/update.active.gig.usecsase';
import { CacheLoginUser } from '../../Infrastructure/databse/cache/Cache';

const createGigInterceptor = new CreateGigUsecase(services.gig, services.uniqueId, services.multer, services.cloudinary, services.user);

const updateGigInterceptor = new UpdateGigUsecase(services.gig,services.user);

const getByIdInterceptor = new GetByIdSellerGig(services.gig, services.user);

const getByCategoryInterceptor = new GetByCategorySellerGig(services.gig, services.user);
const getSellerGigsInterceptor = new GetSellerGigs(services.gig,services.user);
const getPauseGigsInterceptor = new GetSellerPausedGigs(services.gig,services.user);
const deleteGigInterceptor = new DeleteGigUsecase(services.gig);

const gigSearchInterceptor = new SearchGigsUsecase(services.search, services.user);

const gigSeedInterceptor = new GigSeedUsecases(services.gig, services.seller);

const getMoreLikeThisInterceptor=new MoreLikeThisUsecase(services.search,services.user,services.gig)

const updateInterceptor=new updateActiveGigUsecase(services.gig)

const createController = new CreateGig(createGigInterceptor, gigCreateSchema)
const gatewayCache=new CacheLoginUser()
const updateController = new UpdateGig(updateGigInterceptor,updateInterceptor)
const getGigsController = new GetGig(getByIdInterceptor, getSellerGigsInterceptor, getPauseGigsInterceptor,getMoreLikeThisInterceptor,getByCategoryInterceptor,gatewayCache);
const deleteGigController = new DeleteGig(deleteGigInterceptor);
const searchGigController = new GigSearchController(gigSearchInterceptor);

const seedController = new GigSeedController(gigSeedInterceptor);

const GigRouter = (router: Router): Router => {
  router.route('/create-gig').post(upload.single('coverImage'), createController.handle.bind(createController));
  router.route('/gig-sellerId/:sellerId').get(getGigsController.sellerGigs.bind(getGigsController));
  router.route('/update-gig/:gigId').put( updateController.handle.bind(updateController));
  router.route('/update-gig-active/:gigId').put(updateController.gigUpdateActive.bind(updateController))

  router.route('/gig-pause/:sellerId').get(getGigsController.sellerInactiveGigs.bind(getGigsController));

  router.route('/gig-gigId/:gigId').get(getGigsController.gigById.bind(getGigsController));
  router.route('/category/:username').get(getGigsController.gigsByCategory.bind(getGigsController));

  router.route('/search/gig/:page').get(searchGigController.handle.bind(searchGigController));

  router.route('/gig/seed').post(seedController.handle.bind(seedController));
  router.route(`/delete-gig/:gigId/:sellerId`).delete(deleteGigController.handle.bind(deleteGigController));

  router.route('/similar-gig/:gigId').get(getGigsController.moreLikeThis.bind(getGigsController))
  return router;
};

export default GigRouter;
