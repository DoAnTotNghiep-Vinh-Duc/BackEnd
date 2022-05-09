import express from 'express';
import { ProductController } from '../controllers/product-controller';
export const productRoutes = express.Router();

productRoutes.get("/types", ProductController.getProductWithNameType);
productRoutes.get("/types-with-limit-page/:page/:limit", ProductController.getProductWithNameTypeLimitPage);
productRoutes.get("/new-product", ProductController.getNewProduct);
productRoutes.get("/", ProductController.getAllProduct);
productRoutes.get("/top-sell", ProductController.getTopSellProduct);
productRoutes.get("/on-sell", ProductController.getProductOnSale);
productRoutes.get("/sort-point", ProductController.getProductWithSortPoint);
productRoutes.get("/get-all/:page/:limit", ProductController.getAllProductLimitPage);
productRoutes.get("/:product_id", ProductController.getProductAndDetailById);
productRoutes.get("/find/:nameFind", ProductController.getProductWithNameFind);
productRoutes.post("/filter-product", ProductController.filterProduct);