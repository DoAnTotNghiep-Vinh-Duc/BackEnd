import { Product } from "../models/product";
import { ProductDetail } from "../models/product-detail";
import { RedisCache } from "../config/redis-cache";
import { Discount } from "../models/discount";
import { TypeProduct } from "../models/type-product";
import { ObjectId } from "mongodb";
export class ProductService {
    static async getAllProduct() {
        try {
            const products = await Product.aggregate([{$match:{}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            return {status: 200,message: "get all Product success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getAllProductLimitPage(page: number, limit: number) {
        try {
            const products = await Product.aggregate([{$match:{}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$skip:(page-1)*limit},{$limit:limit}])
            return {status: 200,message: "get all Product success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductById(productId: String){
        try {
            const product = await Product.aggregate([{$match:{_id:new ObjectId(`${productId}`)}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            return {status: 200, message: "found Product success", data: product[0]}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getNewProduct(){
        try {
            // const key: String = `getNewProduct(limit:${limit},page:${page})`
            // const data = await RedisCache.getCache(key);
            // if(data){
            //     return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            // }
            const products = await Product.aggregate([{$match:{}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}}]);
            // await RedisCache.setCache(key,JSON.stringify({products}),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductWithNameType(listType: Array<String>){
        try {
            
            // const key: String = `getProductMale(listType:${listType})`
            // const data = await RedisCache.getCache(key);
            // if(data){
            //     return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            // }
            const listTypeProduct = await TypeProduct.aggregate([{$match:{name:{$in:listType}}},{$project:{_id:1}}])
            if(listType.length!==listTypeProduct.length){
                return {status: 404,message: "Not found product !", data: []};
            }
            let convertListType: Array<any> = [];
            for (let index = 0; index < listTypeProduct.length; index++) {
                convertListType.push(listTypeProduct[index]._id);
            }
            const products = await Product.aggregate([{$match:{typeProducts:{$all:convertListType}}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}}])
            // await RedisCache.setCache(key,JSON.stringify({products}),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductWithNameTypeLimitPage(listType: Array<String>, page: number, limit: number){
        try {
            
            // const key: String = `getProductMale(listType:${listType})`
            // const data = await RedisCache.getCache(key);
            // if(data){
            //     return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            // }
            const listTypeProduct = await TypeProduct.aggregate([{$match:{name:{$in:listType}}},{$project:{_id:1}}])
            if(listType.length!==listTypeProduct.length){
                return {status: 404,message: "Not found type product !", data: []};
            }
            let convertListType: Array<any> = [];
            for (let index = 0; index < listTypeProduct.length; index++) {
                convertListType.push(listTypeProduct[index]._id);
            }
            const products = await Product.aggregate([{$match:{typeProducts:{$all:convertListType}}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}},{$skip:(page-1)*limit},{$limit:limit}])
            // await RedisCache.setCache(key,JSON.stringify({products}),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductAndDetailById(productId: String){
        try {
            // const key: String = `getProductById(${productId})`
            // const data = await RedisCache.getCache(key);
            // if(data){
            //     return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            // }
            const products = await Product.aggregate([{$match:{_id:new ObjectId(`${productId}`)}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            const product = products[0]
            console.log("PRODUCT: ", product);
            
            let listProductDetail: any = await ProductDetail.aggregate([{$match:{product:new ObjectId(`${productId}`)}},{$lookup:{from:"Color",localField:"color",foreignField:"_id",as:"color"}},{$unwind:"$color"}])
            if(product){
                const groupByCategory = listProductDetail.reduce((group: any, product: any) => {
                    const color = product.color;
                    group[color.color] = group[color.color] ?? [];
                    group[color.color].push(product);
                    return group;
                  }, []);
                
                  const arrayOfObj = Object.entries(groupByCategory).map((e) => ({
                    [e[0]]: e[1],
                  }));
                // await RedisCache.setCache(key,JSON.stringify({product,listProductDetail:arrayOfObj }),60*5)
                return {status: 200,message: "found Product success !", data:{product,listProductDetail:arrayOfObj }}
            }
            else
                return {status: 404,message: "Not found Product !"}
        } catch (error) {
            console.log(error);
            
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
