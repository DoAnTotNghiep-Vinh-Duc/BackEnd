import express from 'express';
import { ProductController } from '../../controllers/admin/product.controller';
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

productRoutes.get("/", ProductController.getAllProductAdmin);
productRoutes.get("/get-all/:page/:limit", ProductController.getAllProductLimitPageAdmin);
productRoutes.get("/:product_id", ProductController.getProductAndDetailByIdAdmin);
productRoutes.get("/new-product", ProductController.getNewProductAdmin);
productRoutes.get("/types", ProductController.getProductWithNameTypeAdmin);
productRoutes.get("/types-with-limit-page/:page/:limit", ProductController.getProductWithNameTypeLimitPageAdmin);
productRoutes.get("/top-sell", ProductController.getTopSellProductAdmin);
productRoutes.get("/sort-point", ProductController.getProductWithSortPointAdmin);
productRoutes.get("/low-quantity", ProductController.getProductLowQuantityAdmin);
productRoutes.put("/stop-selling-product/:productId", ProductController.stopSellingProduct);
productRoutes.put("/resale-product/:productId", ProductController.resaleProduct);
productRoutes.put("/:product_id",upload.any(), ProductController.updateProductById);
productRoutes.post("/",upload.any(), ProductController.createProduct);