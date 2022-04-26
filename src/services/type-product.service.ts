import {TypeProduct} from "../models/type-product";
export class TypeProductService {
    static async getAllTypeProduct() {
        try {
            const typeProducts = await TypeProduct.find();
            return {status: 200,message: "get all Type Product success !", data: typeProducts};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getTypeProductById(typeProductId: String ){
        try {
            const typeProduct = await TypeProduct.findOne({ _id: typeProductId })
            if(typeProduct){
                return {status: 200,message: "found Type Product success !", data: typeProduct}
            }
            else
                return {status: 404,message: "Not found Type Product !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async createTypeProduct(typeProduct: any, ){
        try {
            const newTypeProduct = new TypeProduct(typeProduct);
            await newTypeProduct.save();
            return {status: 201,message: "create Type Product success !", data: newTypeProduct}
           
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async updateTypeProductById(typeProductId: String, newTypeProduct: any, ){
        try {
            const typeProduct = await TypeProduct.findOne({ _id: typeProductId })
            if(typeProduct){
                const result = await TypeProduct.findByIdAndUpdate(typeProductId, newTypeProduct);
                return{status: 204,message: "update Type Product success !", data: result}
            }
            else
                return{status: 404,message: "Not found Type Product !"}
        } catch (error) {
            return{status: 500,message: "Something went wrong !", error: error};
        }
    }
}
