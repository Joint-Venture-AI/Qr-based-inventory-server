import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/Notification/Notification.route';
import { CategoryRoute } from '../app/modules/category/category.route';
import { PersonalizationRoutes } from '../app/modules/personalization/personalization.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { WishListRoutes } from '../app/modules/wishList/wishList.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/category', route: CategoryRoute },
  { path: '/personalization', route: PersonalizationRoutes },
  { path: '/product', route: ProductRoutes },
  { path: '/wishlist', route: WishListRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
