import { ProductDetailService } from "../services/product-detail.service";
import { Request, Response } from "express";

export class ProductDetailController{
    
    static async getProductDetailByProductId (req: Request, res: Response): Promise<any> {
        try {
            const productId = req.params.productId
            ProductDetailService.getProductDetailByProductId(productId,(data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    
    static async updateProductDetailById (req: Request, res: Response): Promise<any> {
        try {
            const productDetailId = req.params.ProductDetail_id
            const newProductDetail = req.body
            ProductDetailService.updateProductDetailById(productDetailId,newProductDetail, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

