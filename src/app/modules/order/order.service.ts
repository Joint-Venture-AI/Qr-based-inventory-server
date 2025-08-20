import { sendNotifications } from '../../../helpers/notificationHelper';
import { Product } from '../product/product.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (orderData: IOrder) => {
  const order = await Order.create(orderData);

  const products = order.items.map(item => ({
    productId: item.productId,
  }));

  for (const product of products) {
    await Product.findOne({ _id: product.productId });

    const isExist = await Product.findOne({ _id: product.productId });

    await sendNotifications({
      text: `Your order has been placed successfully.`,
      receiver: order.user,
      product: product.productId,
    });

    if (!isExist) {
      throw new Error(`Product does not exist.`);
    }
  }

  return order;
};

export const OrderService = {
  createOrder,
};
