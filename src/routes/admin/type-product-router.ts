import express from 'express';
import { TypeProductController } from '../../controllers/type-product-controller';
export const typeProductRouter = express.Router();

typeProductRouter.get("/typeProduct", TypeProductController.getAllTypeProduct);
typeProductRouter.get("/typeProduct/:typeProductId", TypeProductController.getTypeProductById);
typeProductRouter.put("/typeProduct/:typeProductId", TypeProductController.updateTypeProductById);
typeProductRouter.post("/typeProduct", TypeProductController.createTypeProduct);