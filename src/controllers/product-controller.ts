import { ProductService } from "../services/product.service";
import { Request, Response } from "express";

export class ProductController{
    static async getAllProduct (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getAllProduct();
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getProductAndDetailById (req: Request, res: Response): Promise<any> {
        try {
            const productId = req.params.product_id
            const data = await ProductService.getProductAndDetailById(productId)
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }
    static async getNewProduct (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getNewProduct();
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }
    static async getProductWithNameType (req: Request, res: Response): Promise<any> {
        try {
            const {listType} = req.body
            
            const data = await ProductService.getProductWithNameType(listType);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }
    
    static async updateProductById (req: Request, res: Response): Promise<any> {
        try {
            const productId = req.params.Product_id
            const newProduct = req.body
            const data = await ProductService.updateProductById(productId,newProduct);
            res.status(data.status).send(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async createProduct(req: Request, res: Response): Promise<any> {
        try {
            const {product,productDetails } = req.body
            const data = await ProductService.createProduct(product, productDetails);
            res.status(data.status).send(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

