import { Router } from 'express';
import { SearchGigsUsecase } from '../../UseCases/5-search-usecase/search.gig.usecase';
import { GigSearchController } from '../Controllers/4-gig.controller/search.gig.controller';


const gigSearchInterceptor = new SearchGigsUsecase();
const searchGigController = new GigSearchController(gigSearchInterceptor);
const SearchRouter = (router: Router): Router => {

  router.route('/search/index-search/gig/:page').get(searchGigController.handle.bind(searchGigController));
  return router;
};

export default SearchRouter;
