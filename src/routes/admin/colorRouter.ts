import express from 'express';
import { ColorController } from '../../controllers/admin/ColorController';
export const colorRouter = express.Router();

colorRouter.get("/color", ColorController.getAllColor);
colorRouter.get("/color/:colorId", ColorController.getColorById);
colorRouter.put("/color/:colorId", ColorController.updateColorById);
colorRouter.post("/color", ColorController.createColor);