import { ProductDetail } from "../models/ProductDetail";
import {Product} from "../models/Product"
import { ProductDetailService } from "./ProductDetail.service";
export class ProductService {
    static async getAllProduct(callback: any) {
        try {
            const products = await Product.find();
            callback({message: "get all Product success !", data: products});
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async getProductById(productId: String){
        try {
            const product = await Product.findOne({ _id: productId })
            let listProductDetail: Array<any> = []
            if(product){
                console.log("product list detail: ", product.listProductDetail)
                let productDetail: any = null;
                for(let i=0;i<product.listProductDetail.length;i++){
                    productDetail = await ProductDetail.findOne({_id:product.listProductDetail[i]});
                    listProductDetail.push(productDetail);
                }

                console.log(listProductDetail)
                return {message: "found Product success !", data:{product,listProductDetail }}
            }
            else
                return {message: "Not found Product !"}
        } catch (error) {
            return {message: "Something went wrong !", error: error};
        }
    }
    // Chỗ này phải tạo cả product detail
    static async createProduct(product: any,productDetails: Array<any>,callback: any){
        try {
            const listObjectIdProductDetail: Array<any> = [];
            const newProduct = new Product(product);
            await newProduct.save();

            productDetails.forEach(async (productDetail) => {
                const newProductDetail = new ProductDetail(productDetail)
                newProductDetail.product = newProduct._id;
                await newProductDetail.save();
                listObjectIdProductDetail.push(newProductDetail._id)

            });
            await Product.findOneAndUpdate({_id: newProduct._id},{listProductDetail: listObjectIdProductDetail},{new: true});
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
