import express from 'express';
import { ProductController } from '../controllers/product-controller';
export const productRouter = express.Router();

productRouter.get("/product/types", ProductController.getProductWithType);
productRouter.get("/product", ProductController.getAllProduct);
productRouter.get("/product/:product_id", ProductController.getProductAndDetailById);
productRouter.put("/product/:product_id", ProductController.updateProductById);
productRouter.post("/product", ProductController.createProduct);