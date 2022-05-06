import express from 'express';
import { SupplierController } from '../../controllers/supplier-controller';
export const supplierRoutes = express.Router();

supplierRoutes.get("/supplier", SupplierController.getAllSupplier);
supplierRoutes.get("/supplier/:supplier_id", SupplierController.getSupplierById);
supplierRoutes.put("/supplier/:supplier_id", SupplierController.updateSupplierById);
supplierRoutes.post("/supplier", SupplierController.createSupplier);