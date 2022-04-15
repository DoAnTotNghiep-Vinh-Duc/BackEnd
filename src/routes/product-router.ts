import express from 'express';
import { ProductController } from '../controllers/product-controller';
export const productRouter = express.Router();

productRouter.get("/types", ProductController.getProductWithType);
productRouter.get("/new-product", ProductController.getNewProduct);
productRouter.get("/", ProductController.getAllProduct);
productRouter.get("/:product_id", ProductController.getProductAndDetailById);
productRouter.put("/:product_id", ProductController.updateProductById);
productRouter.post("/", ProductController.createProduct);