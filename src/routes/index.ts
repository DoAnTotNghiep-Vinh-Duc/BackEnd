import express, { Router } from 'express';
import { authRouter } from './auth-router';
import {adminRoutes} from './admin/index'
import { productRouter } from './product-router';
import { cartRouter } from './cart-router';
// import { loginFacebookRouter } from './loginFacebookRouter';
export const Routes = express.Router();
Routes.use('/auth', authRouter)
Routes.use('/admin', adminRoutes);
Routes.use('/product',productRouter )
Routes.use('/cart', cartRouter)