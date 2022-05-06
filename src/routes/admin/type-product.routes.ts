import express from 'express';
import { TypeProductController } from '../../controllers/type-product-controller';
export const typeProductRoutes = express.Router();

typeProductRoutes.get("/typeProduct", TypeProductController.getAllTypeProduct);
typeProductRoutes.get("/typeProduct/:typeProductId", TypeProductController.getTypeProductById);
typeProductRoutes.put("/typeProduct/:typeProductId", TypeProductController.updateTypeProductById);
typeProductRoutes.post("/typeProduct", TypeProductController.createTypeProduct);