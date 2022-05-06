import express, { Router } from 'express';
import { supplierRoutes } from './supplier.routes';
import { typeProductRoutes } from './type-product.routes';
import { colorRoutes } from './color.routes';
export const adminRoutes = express.Router();
adminRoutes.use('/', supplierRoutes);
adminRoutes.use('/', typeProductRoutes);
adminRoutes.use('/', colorRoutes);