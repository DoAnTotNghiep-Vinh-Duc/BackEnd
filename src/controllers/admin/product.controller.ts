import { ProductService } from "../../services/admin/product.service";
import { Request, Response } from "express";

export class ProductController{
    static async getAllProductAdmin (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getAllProductAdmin();
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }

    static async getAllProductLimitPageAdmin (req: Request, res: Response): Promise<any> {
        try {
            const page: any = req.params.page;
            const limit: any = req.params.limit;
            const data = await ProductService.getAllProductLimitPageAdmin(Number.parseInt(page), Number.parseInt(limit));
            return res.status(data.status).json(data);
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getProductAndDetailByIdAdmin (req: Request, res: Response): Promise<any> {
        try {
            const productId = req.params.product_id
            const data = await ProductService.getProductAndDetailByIdAdmin(productId)
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }
    static async getNewProductAdmin (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getNewProductAdmin();
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }
    static async getProductWithNameTypeAdmin (req: Request, res: Response): Promise<any> {
        try {
            const listTypeQuery: any = req.query.listType
            const listType =JSON.parse(listTypeQuery)
            const data = await ProductService.getProductWithNameTypeAdmin(listType);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }
    static async getProductWithNameTypeLimitPageAdmin (req: Request, res: Response): Promise<any> {
        try {
            const listTypeQuery: any = req.query.listType
            const listType =JSON.parse(listTypeQuery)
            const page: any = req.params.page
            const limit: any = req.params.limit
            const data = await ProductService.getProductWithNameTypeLimitPageAdmin(listType, Number.parseInt(page), Number.parseInt(limit));
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getTopSellProductAdmin (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getTopSellProductAdmin();
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getProductWithSortPointAdmin (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getProductWithSortPointAdmin();
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).json({
              msg: error.message,
            });
        }
    }

    static async getProductLowQuantityAdmin (req: Request, res: Response): Promise<any> {
        try {
            const data = await ProductService.getProductLowQuantityAdmin();
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
            const data = await ProductService.updateProductByIdAdmin(uploadFile,JSON.parse(product),JSON.parse(productDetails));
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
            const data = await ProductService.createProductAdmin(uploadFile,JSON.parse(product) , JSON.parse(productDetails));
            res.status(data.status).send(data);
         
        } catch (error: any) {
            console.log(error);
            
            return res.status(500).send({msg: error.message});
        }
    }

    static async stopSellingProduct(req: Request, res: Response): Promise<any> {
        try {
            const {productId } = req.params
            const data = await ProductService.stopSellingProductAdmin(productId);
            res.status(data.status).send(data);
         
        } catch (error: any) {
            console.log(error);
            
            return res.status(500).send({msg: error.message});
        }
    }

    static async resaleProduct(req: Request, res: Response): Promise<any> {
        try {
            const {productId } = req.params
            const data = await ProductService.resaleProductAdmin(productId);
            res.status(data.status).send(data);
         
        } catch (error: any) {
            console.log(error);
            
            return res.status(500).send({msg: error.message});
        }
    }
}

