import { User } from '../user/user.model';
import { Product } from '../product/product.model';

const getAllDashboardData = async () => {
  const [totalUsers, totalProducts] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ status: 'active' }),
  ]);

  return {
    totalUsers,
    totalProducts,
  };
};
export const DashboardService = {
  getAllDashboardData,
};
