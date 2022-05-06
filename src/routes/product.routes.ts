import express from 'express';
import { ProductController } from '../controllers/product-controller';
export const productRoutes = express.Router();
let multer = require("multer"); //the library
let storage = multer.memoryStorage({
    destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
        cb(null, "");
    },
    filename: function (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});//Configure the place you will upload your file
let upload = multer({ storage: storage });

productRoutes.get("/types", ProductController.getProductWithNameType);
productRoutes.get("/types-with-limit-page/:page/:limit", ProductController.getProductWithNameTypeLimitPage);
productRoutes.get("/new-product", ProductController.getNewProduct);
productRoutes.get("/low-quantity", ProductController.getProductLowQuantity);
productRoutes.get("/", ProductController.getAllProduct);
productRoutes.get("/top-sell", ProductController.getTopSellProduct);
productRoutes.get("/on-sell", ProductController.getProductOnSale);
productRoutes.get("/sort-point", ProductController.getProductWithSortPoint);
productRoutes.get("/get-all/:page/:limit", ProductController.getAllProductLimitPage);
productRoutes.get("/:product_id", ProductController.getProductAndDetailById);
productRoutes.put("/:product_id",upload.any(), ProductController.updateProductById);
productRoutes.post("/",upload.any(), ProductController.createProduct);
productRoutes.get("/find/:nameFind", ProductController.getProductWithNameFind);
productRoutes.post("/filter-product", ProductController.filterProduct);