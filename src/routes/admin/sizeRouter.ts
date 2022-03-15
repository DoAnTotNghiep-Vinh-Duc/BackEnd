import express from 'express';
import { SizeController } from '../../controllers/admin/SizeController';
export const sizeRouter = express.Router();

sizeRouter.get("/size", SizeController.getAllSize);
sizeRouter.get("/size/:sizeId", SizeController.getSizeById);
sizeRouter.put("/size/:sizeId", SizeController.updateSizeById);
sizeRouter.post("/size", SizeController.createSize);