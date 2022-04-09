import {Supplier} from "../../models/supplier";
export class SupplierService {
    static async getAllSupplier() {
        try {
            const suppliers = await Supplier.find();
            return{status: 200,message: "get all supplier success !", data: suppliers};
        } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getSupplierById(supplierId: String, ){
        try {
            const supplier = await Supplier.findOne({ _id: supplierId })
            if(supplier){
                return{status: 200,message: "found supplier success !", data: supplier}
            }
            else
                return {status: 404,message: "Not found supplier !"}
        } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async createSupplier(supplier: any, ){
        try {
            const newSupplier = new Supplier(supplier);
            await newSupplier.save();
            return {status: 201,message: "create supplier success !", data: newSupplier}
           
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async updateSupplierById(supplierId: String, newSupplier: any, ){
        try {
            const supplier = await Supplier.findOne({ _id: supplierId })
            if(supplier){
                const result = await supplier.findByIdAndUpdate(supplierId, newSupplier);
                return {status: 204,message: "update supplier success !", data: result}
            }
            else
                return {status: 404,message: "Not found supplier !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
