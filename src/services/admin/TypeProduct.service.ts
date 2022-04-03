const TypeProduct = require("../../models/TypeProduct")
export class TypeProductService {
    static async getAllTypeProduct(callback: any) {
        try {
            const typeProducts = await TypeProduct.find();
            callback({message: "get all Type Product success !", data: typeProducts});
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async getTypeProductById(typeProductId: String, callback: any){
        try {
            const typeProduct = await TypeProduct.findOne({ _id: typeProductId })
            if(typeProduct){
                callback({message: "found Type Product success !", data: typeProduct})
            }
            else
                callback({message: "Not found Type Product !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async createTypeProduct(typeProduct: any, callback: any){
        try {
            const newTypeProduct = new TypeProduct(typeProduct);
            await newTypeProduct.save();
            callback({message: "create Type Product success !", data: newTypeProduct})
           
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async updateTypeProductById(typeProductId: String, newTypeProduct: any, callback: any){
        try {
            const typeProduct = await TypeProduct.findOne({ _id: typeProductId })
            if(typeProduct){
                const result = await TypeProduct.findByIdAndUpdate(typeProductId, newTypeProduct);
                callback({message: "update Type Product success !", data: result})
            }
            else
                callback({message: "Not found Type Product !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }
}
