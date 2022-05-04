import express from 'express';
import { ProductController } from '../controllers/product-controller';
export const productRouter = express.Router();
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
productRouter.post("/",upload.any(), ProductController.createProduct);
productRouter.get("/find/:nameFind", ProductController.getProductWithNameFind);
productRouter.post("/filter-product", ProductController.filterProduct);