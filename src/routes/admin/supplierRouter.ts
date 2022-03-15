import express from 'express';
import { supplierController } from '../../controllers/admin/SupplierController';
export const supplierRouter = express.Router();

supplierRouter.get("/supplier", supplierController.getAllSupplier);
supplierRouter.get("/supplier/:supplier_id", supplierController.getSupplierById);
supplierRouter.put("/supplier/:supplier_id", supplierController.updateSupplierById);