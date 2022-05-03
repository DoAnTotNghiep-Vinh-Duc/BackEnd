import express, { Router } from 'express';
import { authRouter } from './auth-router';
import {adminRoutes} from './admin/index'
import { productRouter } from './product-router';
import { cartRouter } from './cart-router';
import { orderRouter } from './order-router';
import { informationRouter } from './information-router';
import { rateRouter } from './rate-router';
import { favoriteRouter } from './favorite-router';
import { discountRouter } from './discount-router';

export const Routes = express.Router();
Routes.use('/auth', authRouter);
Routes.use('/admin', adminRoutes);
Routes.use('/product',productRouter);
Routes.use('/cart', cartRouter);
Routes.use('/order', orderRouter);
Routes.use('/information', informationRouter);
Routes.use('/rate', rateRouter);
Routes.use('/favorite', favoriteRouter);
Routes.use('/discount', discountRouter);