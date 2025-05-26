import { Router } from "express";
import {
  createOrder,
  createOrderVnpay,
  deleteCart,
  deleteOrder,
  deleteOrderAdmin,
  getAllOrders,
  getAllOrdersByUserId,
  getOrderCode,
  getOrdersById,
  updateOrderStatus,
  UpdateStatusVnpay,
} from "../controllers/order";

const routerOrder = Router();
// tạo đơn hàng
routerOrder.post("/create-order", createOrder);
routerOrder.post("/create-order-Vnpay", createOrderVnpay);
//  Lấy tất cả đơn hàng
routerOrder.get("/get-all-orders/:userId", getAllOrdersByUserId);
routerOrder.get("/get-all-orders", getAllOrders);
// Lấy đơn hàng theo Id
routerOrder.get("/get-orders/:orderId", getOrdersById);
// - Tra cứu đơn hàng theo mã đơn hàng
routerOrder.get("/get-ordersCode/:orderCode", getOrderCode);
routerOrder.put("/update-order/:id", updateOrderStatus);
routerOrder.put("/update-status/:id", UpdateStatusVnpay);
routerOrder.put("/delete-order/:id", deleteOrder);
routerOrder.put("/delete-orderAdmin/:id", deleteOrderAdmin);
routerOrder.post("/delete-cart", deleteCart);
export default routerOrder;
