import { ProductDetail } from "../models/product-detail";
import {Product} from "../models/product"
import { ProductDetailService } from "./product-detail.service";
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
    // product:{
    //     supplier: ObjectId<abc>,
    //     name: "abc",
    //     description:"abcc",
    //     typeProducts:[ObjectId<abc1>,ObjectId<abc2>],
    //     images:[abc.png, gfv.png],
    //     price:50000
    // }
    // productDetails:[
    //     {
    //         color: ObjectId<abc>,
    //         sizeQuantity:[
    //             {
    //                 size:"M",
    //                 quantity:20
    //             },
    //             {
    //                 size:"S",
    //                 quantity:20
    //             },
    //             {
    //                 size:"L",
    //                 quantity:20
    //             },
    //         ]
    //     },
    //     {
    //         color: ObjectId<abc>,
    //         sizeQuantity:[
    //             {
    //                 size:"M",
    //                 quantity:20
    //             },
    //             {
    //                 size:"S",
    //                 quantity:20
    //             },
    //             {
    //                 size:"L",
    //                 quantity:20
    //             },
    //         ]
    //     }
    // ]
   
    static async createProduct(product: any,productDetails: Array<any>,callback: any){
        try {
            const listObjectIdProductDetail: Array<any> = [];
            const newProduct = new Product(product);
            await newProduct.save();

            for(let i =0;i< productDetails.length;i++){
                let sizeQuantity:Array<any> = productDetails[i].sizeQuantity;
                for(let j=0;j < sizeQuantity.length;i++){
                    const productDetail = {
                        product: newProduct._id,
                        color: productDetails[i].color,
                        size: sizeQuantity[j].size,
                        quantity: sizeQuantity[j].quantity
                    }
                    const newProductDetail = new ProductDetail(productDetail)
                    await newProductDetail.save();
                    listObjectIdProductDetail.push(newProductDetail._id)
                }
            }
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
