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

    static async getAllProductLimitPage (req: Request, res: Response): Promise<any> {
        try {
            const page: any = req.params.page;
            const limit: any = req.params.limit;
            const data = await ProductService.getAllProductLimitPage(Number.parseInt(page), Number.parseInt(limit));
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
            const listTypeQuery: any = req.query.listType
            const listType =JSON.parse(listTypeQuery)
            const data = await ProductService.getProductWithNameType(listType);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getTopSellProduct (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getTopSellProduct();
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getProductOnSale (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getProductOnSale();
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getProductWithSortPoint (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getProductWithSortPoint();
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getProductLowQuantity (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getProductLowQuantity();
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getProductWithNameFind (req: Request, res: Response): Promise<any> {
        try {
            const {nameFind} = req.params
            console.log(nameFind);
            
            const data = await ProductService.getProductWithNameFind(nameFind);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async filterProduct (req: Request, res: Response): Promise<any> {
        try {
            const {optionSort, optionPrice, optionSizes, optionColors, optionRates} = req.body;
            const data: any = await ProductService.filterProduct(optionSort, optionPrice, optionSizes, optionColors, optionRates);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getProductWithNameTypeLimitPage (req: Request, res: Response): Promise<any> {
        try {
            const listTypeQuery: any = req.query.listType
            const listType =JSON.parse(listTypeQuery)
            const page: any = req.params.page
            const limit: any = req.params.limit
            const data = await ProductService.getProductWithNameTypeLimitPage(listType, Number.parseInt(page), Number.parseInt(limit));
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }
    
    static async updateProductById (req: Request, res: Response): Promise<any> {
        try {
            const {product,productDetails } = req.body
            const uploadFile = req.files;
            const data = await ProductService.updateProductById(uploadFile,JSON.parse(product),JSON.parse(productDetails));
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
            const uploadFile = req.files;
            const data = await ProductService.createProduct(uploadFile,JSON.parse(product) , JSON.parse(productDetails));
            res.status(data.status).send(data);
         
        } catch (error: any) {
            console.log(error);
            
            return res.status(500).send({msg: error.message});
        }
    }
}

