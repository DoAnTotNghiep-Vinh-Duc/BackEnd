import express, { Router } from 'express';
import { supplierRoutes } from './supplier.routes';
import { typeProductRoutes } from './type-product.routes';
import { colorRoutes } from './color.routes';
import {productRoutes} from './product.routes';
import {orderRoutes} from './order.routes'
import {accountRoutes} from './account.routes';
export const adminRoutes = express.Router();
adminRoutes.use('/', supplierRoutes);
adminRoutes.use('/', typeProductRoutes);
adminRoutes.use('/', colorRoutes);
adminRoutes.use('/product', productRoutes);
adminRoutes.use('/order',orderRoutes);
adminRoutes.use('/account', accountRoutes);