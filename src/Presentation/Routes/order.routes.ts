import { Router } from 'express';
import { CreateOrderUsecase } from '../../UseCases/7-order-usecase/create.order.usecase';
import { CreateOrderController } from '../Controllers/6-order.controller/create.order.controller';
import { GetOrdersUsecase } from '../../UseCases/7-order-usecase/getOrders.order.usecase';
import { OrderBySellerId } from '../Controllers/6-order.controller/sellerId.order.controller';
import { OrderByBuyerId } from '../Controllers/6-order.controller/buyerId.order.controller';
import { GetOrderIdUsecase } from '../../UseCases/7-order-usecase/get.order.usecase';
import { OrderByOrderId } from '../Controllers/6-order.controller/orderid.order.controller';
import { UpdateRequestExtensionUsecase } from '../../UseCases/7-order-usecase/requestExtension.order.usecase';
import { UpdateOrderController } from '../Controllers/6-order.controller/update.order.controller';
import { ApproveOrderUsecase } from '../../UseCases/7-order-usecase/approveOrderusecase';
import { SellerDeliverOrderUsecase } from '../../UseCases/7-order-usecase/seller.orderDelivered.usecase';
import services from '../../Services';
import upload from '../middlewares/multer';

const createOrderInterceptor = new CreateOrderUsecase();
const getOrdersInterceptors = new GetOrdersUsecase();
const getOrderIdInterceptor = new GetOrderIdUsecase();

const createOrder = new CreateOrderController(createOrderInterceptor);

const updateRequestExtensionInterceptor = new UpdateRequestExtensionUsecase();

const getOrdersBySellerIdController = new OrderBySellerId(getOrdersInterceptors);

const getOrdersByBuyerIdController = new OrderByBuyerId(getOrdersInterceptors);

const getOrderIdController = new OrderByOrderId(getOrderIdInterceptor);

const sellerDeliverOrderInterceptor=new SellerDeliverOrderUsecase()

const approveOrderInterceptor=new ApproveOrderUsecase()

const updateOrderController = new UpdateOrderController(updateRequestExtensionInterceptor,approveOrderInterceptor,sellerDeliverOrderInterceptor,services.uniqueId,services.cloudinary,services.multer);

const OrderRouter = (router: Router): Router => {
  router.route('/order/deliver-order/:orderId').post(upload.single('deliveryFile'),updateOrderController.deliverOrder.bind(updateOrderController))
  router.route('/order/order-create').post(createOrder.handle.bind(createOrder));

  router.route('/order/order-orderId/:orderId').get(getOrderIdController.handle.bind(getOrderIdController));

  router.route('/order/order-seller/:sellerId').get(getOrdersBySellerIdController.handle.bind(getOrdersBySellerIdController));

  router.route('/order/order-buyer/:buyerId').get(getOrdersByBuyerIdController.handle.bind(getOrdersByBuyerIdController));

  router.route('/order/order-update-extension/:orderId').put(updateOrderController.requestExtension.bind(updateOrderController));
  
  router.route('/order/approve-order/:orderId').put(updateOrderController.buyerApproveOrder.bind(updateOrderController))

  return router;
};

export default OrderRouter;
