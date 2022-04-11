import { ProductDetailService } from "../services/product-detail.service";
import { Request, Response } from "express";

export class ProductDetailController{
    
    static async getProductDetailByProductId (req: Request, res: Response): Promise<any> {
        try {
            const productId = req.params.productId
            const data = await ProductDetailService.getProductDetailByProductId(productId);
            res.status(data.status).send(data);
         
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
            const data = await ProductDetailService.updateProductDetailById(productDetailId,newProductDetail);
            res.status(data.status).send(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

