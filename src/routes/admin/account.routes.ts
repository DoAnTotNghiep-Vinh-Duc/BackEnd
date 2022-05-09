import express from 'express';
import { AccountController } from '../../controllers/admin/account.controller';
export const accountRoutes = express.Router();

accountRoutes.get("/", AccountController.getAllAccountWithOrderQuantity);