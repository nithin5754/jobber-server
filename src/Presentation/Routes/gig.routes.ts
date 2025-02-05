import { Router } from 'express';
import services from '../../Services';
import { CacheLoginUser } from '../../Database/cache/Cache';
import { CreateGigUsecase } from '../../UseCases/4-gig-usecase/create.gig.usecase';
import { DeleteGigUsecase } from '../../UseCases/4-gig-usecase/delete.gig.usecase';
import { GetByCategorySellerGig } from '../../UseCases/4-gig-usecase/get-category.gig.usecase';
import { GetByIdSellerGig } from '../../UseCases/4-gig-usecase/get-id.gig.usecase';
import { MoreLikeThisUsecase } from '../../UseCases/4-gig-usecase/get-MoreGigsLikeThis';
import { GetSellerPausedGigs } from '../../UseCases/4-gig-usecase/get-paused.gig.usecses';
import { GetSellerGigs } from '../../UseCases/4-gig-usecase/get-sellerId.gig.usecase';
import { GigSeedUsecases } from '../../UseCases/4-gig-usecase/seed.gig.usecase';
import { UpdateGigUsecase } from '../../UseCases/4-gig-usecase/updata.gig.usecase';
import { updateActiveGigUsecase } from '../../UseCases/4-gig-usecase/update.active.gig.usecsase';
import { SearchGigsUsecase } from '../../UseCases/5-search-usecase/search.gig.usecase';
import { CreateGig } from '../Controllers/4-gig.controller/create.gig.controller';
import { DeleteGig } from '../Controllers/4-gig.controller/delete.gig.controller';
import { GetGig } from '../Controllers/4-gig.controller/get.gig.controller';
import { GigSearchController } from '../Controllers/4-gig.controller/search.gig.controller';
import { GigSeedController } from '../Controllers/4-gig.controller/seed.controller';
import { UpdateGig } from '../Controllers/4-gig.controller/update.gig.controller';
import upload from '../middlewares/multer';
import { gigCreateSchema } from '../schemas/4-gig-schemas/gig.schemas';

const createGigInterceptor = new CreateGigUsecase(services.uniqueId, services.multer, services.cloudinary);

const updateGigInterceptor = new UpdateGigUsecase();

const getByIdInterceptor = new GetByIdSellerGig();

const getByCategoryInterceptor = new GetByCategorySellerGig();
const getSellerGigsInterceptor = new GetSellerGigs();
const getPauseGigsInterceptor = new GetSellerPausedGigs();
const deleteGigInterceptor = new DeleteGigUsecase();

const gigSearchInterceptor = new SearchGigsUsecase();

const gigSeedInterceptor = new GigSeedUsecases();

const getMoreLikeThisInterceptor = new MoreLikeThisUsecase();

const updateInterceptor = new updateActiveGigUsecase();

const createController = new CreateGig(createGigInterceptor, gigCreateSchema);
const gatewayCache = new CacheLoginUser();
const updateController = new UpdateGig(updateGigInterceptor, updateInterceptor);
const getGigsController = new GetGig(
  getByIdInterceptor,
  getSellerGigsInterceptor,
  getPauseGigsInterceptor,
  getMoreLikeThisInterceptor,
  getByCategoryInterceptor,
  gatewayCache
);
const deleteGigController = new DeleteGig(deleteGigInterceptor);
const searchGigController = new GigSearchController(gigSearchInterceptor);

const seedController = new GigSeedController(gigSeedInterceptor);

const GigRouter = (router: Router): Router => {
  router.route('/create-gig').post(upload.single('coverImage'), createController.handle.bind(createController));
  router.route('/gig-sellerId/:sellerId').get(getGigsController.sellerGigs.bind(getGigsController));
  router.route('/update-gig/:gigId').put(updateController.handle.bind(updateController));
  router.route('/update-gig-active/:gigId').put(updateController.gigUpdateActive.bind(updateController));

  router.route('/gig-pause/:sellerId').get(getGigsController.sellerInactiveGigs.bind(getGigsController));

  router.route('/gig-gigId/:gigId').get(getGigsController.gigById.bind(getGigsController));
  router.route('/category/:username').get(getGigsController.gigsByCategory.bind(getGigsController));

  router.route('/search/gig/:page').get(searchGigController.handle.bind(searchGigController));

  router.route('/gig/seed').get(seedController.handle.bind(seedController));
  router.route(`/delete-gig/:gigId/:sellerId`).delete(deleteGigController.handle.bind(deleteGigController));

  router.route('/similar-gig/:gigId').get(getGigsController.moreLikeThis.bind(getGigsController));
  return router;
};

export default GigRouter;
