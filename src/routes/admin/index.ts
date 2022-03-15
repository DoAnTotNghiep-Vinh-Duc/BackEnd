import express, { Router } from 'express';
import {producerRouter} from './producerRouter'
import { supplierRouter } from './supplierRouter';
import { typeProductRouter } from './typeProductRouter';
export const AdminRoutes = express.Router();
AdminRoutes.use('/', producerRouter)
AdminRoutes.use('/', supplierRouter)
AdminRoutes.use('/', typeProductRouter)