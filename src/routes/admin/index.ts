import express, { Router } from 'express';
import {producerRouter} from './producerRouter'
import { supplierRouter } from './supplierRouter';
import { typeProductRouter } from './typeProductRouter';
import { sizeRouter } from './sizeRouter';
import { colorRouter } from './colorRouter';
export const AdminRoutes = express.Router();
AdminRoutes.use('/', producerRouter);
AdminRoutes.use('/', supplierRouter);
AdminRoutes.use('/', typeProductRouter);
AdminRoutes.use('/', sizeRouter);
AdminRoutes.use('/', colorRouter);