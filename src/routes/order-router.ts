import express from 'express';
import { OrderController } from '../controllers/order-controller';
export const orderRouter = express.Router();

orderRouter.post("/", OrderController.createOrder);