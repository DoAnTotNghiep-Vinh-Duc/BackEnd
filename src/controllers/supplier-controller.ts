import { SupplierService } from "../services/admin/supplier.service";
import { Request, Response } from "express";

export class SupplierController {
    static async getAllSupplier (req: Request, res: Response): Promise<any> {
        try {
            const data = await SupplierService.getAllSupplier();
            return res.status(data.status).json(data)
        
        } catch (error: any) {
            return res.status(500).send({
            msg: error.message,
            });
        }
    }
    
    static async getSupplierById(req: Request, res: Response): Promise<any> {
        try {
            const supplierId = req.params.supplier_id
            const data = await SupplierService.getSupplierById(supplierId);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
    
    static async updateSupplierById(req: Request, res: Response): Promise<any> {
        try {
            const supplierId = req.params.supplier_id
            const newSupplier = req.body
            const data = await SupplierService.updateSupplierById(supplierId,newSupplier);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }

    static async createSupplier(req: Request, res: Response): Promise<any> {
        try {
            const newSupplier = req.body
            const data = await SupplierService.createSupplier(newSupplier);
            return res.status(data.status).json(data)
         
        } catch (error: any) {
            return res.status(500).send({
              msg: error.message,
            });
        }
    }
}

// const supplierController = {
//     getAllSupplier,
//     getSupplierById,
//     updateSupplierById
// };

// export { supplierController };
