import { ProductService } from "../services/Product.service";
import { Request, Response } from "express";

export class ProductController{
    static async getAllProduct (req: Request, res: Response): Promise<any> {
        try {
            ProductService.getAllProduct((data: any) => {
                res.status(200).send(data);
            });
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getProductById (req: Request, res: Response): Promise<any> {
        try {
            const productId = req.params.product_id
            ProductService.getProductById(productId,(data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    
    static async updateProductById (req: Request, res: Response): Promise<any> {
        try {
            const productId = req.params.Product_id
            const newProduct = req.body
            ProductService.updateProductById(productId,newProduct, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async createProduct(req: Request, res: Response): Promise<any> {
        try {
            const newProduct = req.body
            ProductService.createProduct(newProduct, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

