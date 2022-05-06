import express from 'express';
import { ColorController } from '../../controllers/color-controller';
export const colorRoutes = express.Router();

colorRoutes.get("/color", ColorController.getAllColor);
colorRoutes.get("/color/:colorId", ColorController.getColorById);
colorRoutes.put("/color/:colorId", ColorController.updateColorById);
colorRoutes.post("/color", ColorController.createColor);