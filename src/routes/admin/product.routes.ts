import express from 'express';
import { ProductController } from '../../controllers/admin/product.controller';
import { AuthMiddleware } from '../../middleware/auth-middleware';
import { CheckAdminMiddleware } from '../../middleware/check-admin-middleware';
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

productRoutes.get("/",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getAllProductAdmin);
productRoutes.get("/filter-product",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.filterProductAdmin);
productRoutes.get("/get-all/:page/:limit",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getAllProductLimitPageAdmin);
productRoutes.get("/new-product",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getNewProductAdmin);
productRoutes.get("/types",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getProductWithNameTypeAdmin);
productRoutes.get("/types-with-limit-page/:page/:limit",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getProductWithNameTypeLimitPageAdmin);
productRoutes.get("/top-sell",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getTopSellProductAdmin);
productRoutes.get("/sort-point",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getProductWithSortPointAdmin);
productRoutes.get("/low-quantity",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getProductLowQuantityAdmin);
productRoutes.put("/stop-selling-product/:productId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.stopSellingProduct);
productRoutes.put("/resale-product/:productId",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.resaleProduct);
productRoutes.get("/:product_id",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, ProductController.getProductAndDetailByIdAdmin);
productRoutes.put("/:product_id",AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, upload.any(), ProductController.updateProductById);
productRoutes.post("/", AuthMiddleware.verifyAccessToken,CheckAdminMiddleware.isAdmin, upload.any(), ProductController.createProduct);