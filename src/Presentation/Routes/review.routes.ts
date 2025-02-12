import { Router } from 'express';
import { CreateReviewUsecase } from '../../UseCases/8-review-usecase/create.review.usecase';
import { CreateReviewController } from '../Controllers/7-review.controller/create.review.controller';
import { GetByGigIdReviewUsecase } from '../../UseCases/8-review-usecase/getByGigId.review.usecase';
import { GetGigIdReviewController } from '../Controllers/7-review.controller/get-gigId.review.controller';

const createReviewInterceptor = new CreateReviewUsecase();
const getGigIdReviewInterceptor = new GetByGigIdReviewUsecase();

const create = new CreateReviewController(createReviewInterceptor);
const getByGigIdController = new GetGigIdReviewController(getGigIdReviewInterceptor);

const ReviewRouter = (router: Router): Router => {
  router.route('/review/review-gig/:gigId').get(getByGigIdController.handle.bind(getByGigIdController));
  router.route('/review/review-seller/:sellerId').get(getByGigIdController.handle.bind(getByGigIdController));
  router.route('/review-create').post(create.handle.bind(create));

  return router;
};

export default ReviewRouter;
