import express from 'express';
import { ProductController } from '../controllers/product-controller';
export const productRouter = express.Router();

productRouter.get("/types", ProductController.getProductWithNameType);
productRouter.get("/types-with-limit-page/:page/:limit", ProductController.getProductWithNameTypeLimitPage);
productRouter.get("/new-product", ProductController.getNewProduct);
productRouter.get("/low-quantity", ProductController.getProductLowQuantity);
productRouter.get("/", ProductController.getAllProduct);
productRouter.get("/top-sell", ProductController.getTopSellProduct);
productRouter.get("/on-sell", ProductController.getProductOnSale);
productRouter.get("/sort-point", ProductController.getProductWithSortPoint);
productRouter.get("/get-all/:page/:limit", ProductController.getAllProductLimitPage);
productRouter.get("/:product_id", ProductController.getProductAndDetailById);
productRouter.put("/:product_id", ProductController.updateProductById);
productRouter.post("/", ProductController.createProduct);