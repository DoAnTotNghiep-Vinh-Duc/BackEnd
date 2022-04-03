import express, { Router } from 'express';
import { supplierRouter } from './supplierRouter';
import { typeProductRouter } from './typeProductRouter';
import { colorRouter } from './colorRouter';
export const AdminRoutes = express.Router();
AdminRoutes.use('/', supplierRouter);
AdminRoutes.use('/', typeProductRouter);
AdminRoutes.use('/', colorRouter);