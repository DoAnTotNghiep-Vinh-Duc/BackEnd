const Product = require("../../models/Product")
export class ProductService {
    static async getAllProduct(callback: any) {
        try {
            const products = await Product.find();
            callback({message: "get all Product success !", data: products});
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async getProductById(productId: String, callback: any){
        try {
            const product = await Product.findOne({ _id: productId })
            if(product){
                callback({message: "found Product success !", data: product})
            }
            else
                callback({message: "Not found Product !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async createProduct(product: any, callback: any){
        try {
            const newProduct = new Product(product);
            await newProduct.save();
            callback({message: "create Product success !", data: newProduct})
           
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async updateProductById(productId: String, newProduct: any, callback: any){
        try {
            const product = await Product.findOne({ _id: productId })
            if(product){
                const result = await Product.findByIdAndUpdate(productId, newProduct);
                callback({message: "update Product success !", data: result})
            }
            else
                callback({message: "Not found Product !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }
}
