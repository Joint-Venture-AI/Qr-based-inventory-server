import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { OrderController } from './order.controller';

const router = express.Router();

router.post(
  '/create-order',
  auth(USER_ROLES.USER),
  OrderController.createOrder
);

export const OrderRoutes = router;
