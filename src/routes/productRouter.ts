import express from 'express';
import { ProductController } from '../controllers/ProductController';
export const productRouter = express.Router();

productRouter.get("/product", ProductController.getAllProduct);
productRouter.get("/product/:product_id", ProductController.getProductById);
productRouter.put("/product/:product_id", ProductController.updateProductById);
productRouter.post("/product", ProductController.createProduct);