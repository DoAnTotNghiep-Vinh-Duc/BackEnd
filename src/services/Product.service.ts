import { ProductDetail } from "../models/product-detail";
import {Product} from "../models/product"
import { ProductDetailService } from "./product-detail.service";
import { ColorService } from "./admin/color.service";
import { Color } from "../models/color";
import { ColorImageService } from "./color-image.service";
export class ProductService {
    static async getAllProduct() {
        try {
            const products = await Product.find();
            return {status: 200,message: "get all Product success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
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
                    let data = await ColorService.getColorById(productDetail.color)
                    productDetail.color = data.data
                    listProductDetail.push(productDetail);
                }
                const colorImages = await ColorImageService.getColorImageByProductId(productId)
                return {status: 200,message: "found Product success !", data:{product,listProductDetail, colorImages }}
            }
            else
                return {status: 404,message: "Not found Product !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
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
   
    static async createProduct(product: any,productDetails: Array<any>){
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
            return {status:201,message: "create Product success !", data: newProduct};
           
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async updateProductById(productId: String, newProduct: any){
        try {
            const product = await Product.findOne({ _id: productId })
            if(product){
                const result = await Product.findByIdAndUpdate(productId, newProduct);
                return {status: 204,message: "update Product success !", data: result};
            }
            else
                return {status: 404,message: "Not found Product !"};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
