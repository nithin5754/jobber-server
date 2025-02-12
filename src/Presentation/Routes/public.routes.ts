import { Router } from 'express';
import { GetByCategorySellerGig } from '../../UseCases/4-gig-usecase/get-category.gig.usecase';
import { PublicGigsByCategory } from '../Controllers/8-public-controller/get.gig-category.controller';

const gigByCategoryInterceptor = new GetByCategorySellerGig();

const publicGigByCategory = new PublicGigsByCategory(gigByCategoryInterceptor);

const PublicRouter = (router: Router): Router => {
  router.route('/public-category/:category').get(publicGigByCategory.handle.bind(publicGigByCategory));
  return router;
};

export default PublicRouter;
