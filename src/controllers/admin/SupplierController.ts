import { SupplierService } from "../../services/admin/SupplierService";
import { Request, Response } from "express";

const getAllSupplier = async (req: Request, res: Response): Promise<any> => {
    try {
        SupplierService.getAllSupplier((data: any) => {
        res.status(200).send(data);
        });
    
    } catch (error: any) {
        return res.status(500).send({
        msg: error.message,
        });
    }
}

const getSupplierById = async (req: Request, res: Response): Promise<any> => {
    try {
        const supplierId = req.params.supplier_id
        SupplierService.getSupplierById(supplierId,(data: any) => {
          res.status(200).send(data);
        });
     
    } catch (error: any) {
        return res.status(500).send({
          msg: error.message,
        });
    }
}

const updateSupplierById = async (req: Request, res: Response): Promise<any> => {
    try {
        const supplierId = req.params.supplier_id
        const newSupplier = req.body
        SupplierService.updateSupplierById(supplierId,newSupplier, (data: any) => {
          res.status(200).send(data);
        });
     
    } catch (error: any) {
        return res.status(500).send({
          msg: error.message,
        });
    }
}
const supplierController = {
    getAllSupplier,
    getSupplierById,
    updateSupplierById
};

export { supplierController };
