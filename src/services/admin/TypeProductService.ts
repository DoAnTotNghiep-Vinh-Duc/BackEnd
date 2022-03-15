const Supplier = require("../../models/Supplier")
export class SupplierService {
    static async getAllSupplier(callback: any) {
        try {
            const suppliers = await Supplier.find();
            callback({message: "get all supplier success !", data: suppliers});
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async getSupplierById(supplierId: String, callback: any){
        try {
            const supplier = await Supplier.findOne({ _id: supplierId })
            if(supplier){
                callback({message: "found supplier success !", data: supplier})
            }
            else
                callback({message: "Not found supplier !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }
    static async updateSupplierById(supplierId: String, newSupplier: any, callback: any){
        try {
            const supplier = await Supplier.findOne({ _id: supplierId })
            if(supplier){
                const result = await supplier.findByIdAndUpdate(supplierId, newSupplier);
                callback({message: "update supplier success !", data: result})
            }
            else
                callback({message: "Not found supplier !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }
}
