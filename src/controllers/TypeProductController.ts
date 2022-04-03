import { TypeProductService } from "../services/admin/TypeProduct.service";
import { Request, Response } from "express";

export class TypeProductController {
    static async getAllTypeProduct (req: Request, res: Response): Promise<any> {
        try {
            TypeProductService.getAllTypeProduct((data: any) => {
            res.status(200).send(data);
            });
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getTypeProductById(req: Request, res: Response): Promise<any> {
        try {
            const typeProductId = req.params.typeProductId
            TypeProductService.getTypeProductById(typeProductId,(data: any) => {
              res.status(200).send(data);
            });
         
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
            TypeProductService.updateTypeProductById(typeProductId,newTypeProduct, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async createTypeProduct(req: Request, res: Response): Promise<any> {
        try {
            const newTypeProduct = req.body
            TypeProductService.createTypeProduct(newTypeProduct, (data: any) => {
              res.status(200).send(data);
            });
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

