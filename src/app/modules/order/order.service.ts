import { Product } from '../product/product.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (orderData: IOrder) => {
  // Check product existence first
  const productIds = orderData.items.map(item => item.productId);
  const existingProducts = await Product.find({ _id: { $in: productIds } });

  if (existingProducts.length !== productIds.length) {
    throw new Error('One or more products do not exist.');
  }

  // Create order only after validation
  const order = await Order.create(orderData);
  return order;
};

export const OrderService = {
  createOrder,
};
