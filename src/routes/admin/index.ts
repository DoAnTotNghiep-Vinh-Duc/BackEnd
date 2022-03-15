import express, { Router } from 'express';
import {producerRouter} from './producerRouter'
import { supplierRouter } from './supplierRouter';
export const AdminRoutes = express.Router();
AdminRoutes.use('/admin', producerRouter)
AdminRoutes.use('/admin', supplierRouter)