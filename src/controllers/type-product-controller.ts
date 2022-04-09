import { TypeProductService } from "../services/admin/type-product.service";
import { Request, Response } from "express";

export class TypeProductController {
    static async getAllTypeProduct (req: Request, res: Response): Promise<any> {
        try {
            const data = await TypeProductService.getAllTypeProduct();
            return res.status(data.status).json(data)
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getTypeProductById(req: Request, res: Response): Promise<any> {
        try {
            const typeProductId = req.params.typeProductId
            const data = await TypeProductService.getTypeProductById(typeProductId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    
    static async updateTypeProductById(req: Request, res: Response): Promise<any> {
        try {
            const typeProductId = req.params.typeProductId
            const newTypeProduct = req.body
            const data = await TypeProductService.updateTypeProductById(typeProductId,newTypeProduct);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async createTypeProduct(req: Request, res: Response): Promise<any> {
        try {
            const newTypeProduct = req.body
            const data = await TypeProductService.createTypeProduct(newTypeProduct);
            return res.status(data.status).json(data);
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

