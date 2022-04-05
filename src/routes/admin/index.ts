import express, { Router } from 'express';
import { supplierRouter } from './supplier-router';
import { typeProductRouter } from './type-product-router';
import { colorRouter } from './color-router';
export const adminRoutes = express.Router();
adminRoutes.use('/', supplierRouter);
adminRoutes.use('/', typeProductRouter);
adminRoutes.use('/', colorRouter);