import express, { Router } from 'express';
import { authRoutes } from './auth.routes';
import {adminRoutes} from './admin/index'
import { productRoutes } from './product.routes';
import { cartRoutes } from './cart.routes';
import { orderRoutes } from './order.routes';
import { informationRoutes } from './information.routes';
import { rateRoutes } from './rate.routes';
import { favoriteRoutes } from './favorite.routes';
import {roomRoutes} from './room.routes'
import { messageRoutes } from './message.routes';

export const Routes = express.Router();
Routes.use('/auth', authRoutes);
Routes.use('/admin', adminRoutes);
Routes.use('/product',productRoutes);
Routes.use('/cart', cartRoutes);
Routes.use('/order', orderRoutes);
Routes.use('/information', informationRoutes);
Routes.use('/rate', rateRoutes);
Routes.use('/favorite', favoriteRoutes);
Routes.use('/room', roomRoutes);
Routes.use('/message', messageRoutes);