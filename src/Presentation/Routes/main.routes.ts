import { Application, Router } from 'express';
import authRouter from './auth.routes';
import { authMiddleware } from '../middlewares/authMiddleware';
import CurrentRouter from './current-user.routes';
import BuyerRouter from './buyer.routes';
import SellerRouter from './seller.routes';
import GigRouter from './gig.routes';
import ChatRouter from './chat.routes';
import OrderRouter from './order.routes';
import ReviewRouter from './review.routes';
import SearchRouter from './search.routes';
import PublicRouter from './public.routes';

export const routes = (app: Application, router: Router) => {
  app.use('/api/v1/auth', authRouter(router));
  app.use('/api/v1/public',PublicRouter(router))
  app.use('/api/v1/search',SearchRouter(router))
  app.use('/api/v1/current', authMiddleware.verifyJWT, CurrentRouter(router));
  app.use('/api/v1/buyer', authMiddleware.verifyJWT, BuyerRouter(router));
  app.use('/api/v1/seller', authMiddleware.verifyJWT, SellerRouter(router));
  app.use('/api/v1/gig', authMiddleware.verifyJWT, GigRouter(router));
  app.use('/api/v1/chat', authMiddleware.verifyJWT, ChatRouter(router));
  app.use('/api/v1/order', authMiddleware.verifyJWT, OrderRouter(router));
  app.use('/api/v1/review',authMiddleware.verifyJWT,ReviewRouter(router))
};

export default routes;
