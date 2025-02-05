import { Router } from 'express';
import { CreateOrderUsecase } from '../../UseCases/7-order-usecase/create.order.usecase';
import { CreateOrderController } from '../Controllers/6-order.controller/create.order.controller';
import { GetOrdersUsecase } from '../../UseCases/7-order-usecase/getOrders.order.usecase';
import { OrderBySellerId } from '../Controllers/6-order.controller/sellerId.order.controller';
import { OrderByBuyerId } from '../Controllers/6-order.controller/buyerId.order.controller';
import { GetOrderIdUsecase } from '../../UseCases/7-order-usecase/get.order.usecase';
import { OrderByOrderId } from '../Controllers/6-order.controller/orderid.order.controller';

const createOrderInterceptor = new CreateOrderUsecase();
const getOrdersInterceptors = new GetOrdersUsecase();
const getOrderIdInterceptor = new GetOrderIdUsecase();

const createOrder = new CreateOrderController(createOrderInterceptor);

const getOrdersBySellerIdController = new OrderBySellerId(getOrdersInterceptors);

const getOrdersByBuyerIdController = new OrderByBuyerId(getOrdersInterceptors);

const getOrderIdController = new OrderByOrderId(getOrderIdInterceptor);

const OrderRouter = (router: Router): Router => {
  router.route('/order-create').post(createOrder.handle.bind(createOrder));

  router.route('/order-seller/:sellerId').get(getOrdersBySellerIdController.handle.bind(getOrdersBySellerIdController));

  router.route('/order-buyer/:buyerId').get(getOrdersByBuyerIdController.handle.bind(getOrdersByBuyerIdController));

  router.route('/order-orderId/:orderId').get(getOrderIdController.handle.bind(getOrderIdController));

  return router;
};

export default OrderRouter;
