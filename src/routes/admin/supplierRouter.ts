import express from 'express';
import { SupplierController } from '../../controllers/admin/SupplierController';
export const supplierRouter = express.Router();

supplierRouter.get("/supplier", SupplierController.getAllSupplier);
supplierRouter.get("/supplier/:supplier_id", SupplierController.getSupplierById);
supplierRouter.put("/supplier/:supplier_id", SupplierController.updateSupplierById);
supplierRouter.post("/supplier", SupplierController.createSupplier);