import { Product } from "../models/product";
import { ProductDetail } from "../models/product-detail";
import { RedisCache } from "../config/redis-cache";
import { Discount } from "../models/discount";
import { TypeProduct } from "../models/type-product";
import { ObjectId } from "mongodb";
import { Order } from "../models/order";
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
            // const products = await Product.aggregate([{$match:{}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$skip:(page-1)*limit},{$limit:limit}])
            const products = await Product.aggregate([{$match:{}}, {$lookup:{from:"ProductDetail", localField:"_id",foreignField:"product", as:"productDetail"}},{$skip:(page-1)*limit},{$limit:limit},{$unwind:"$productDetail"},{"$group": { "_id": "$_id",product:{$first:"$$ROOT"},quantity:{$sum:"$productDetail.quantity"} }},{ "$replaceRoot": { "newRoot": { "$mergeObjects": ["$product", { quantity: "$quantity" }]} } },{$project:{"productDetail":0}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            return {status: 200,message: "get all Product success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductLowQuantity() {
        try {
            const products = await Product.aggregate([{$match:{}}, {$lookup:{from:"ProductDetail", localField:"_id",foreignField:"product", as:"productDetail"}},{$unwind:"$productDetail"},{"$group": { "_id": "$_id",product:{$first:"$$ROOT"},quantity:{$sum:"$productDetail.quantity"} }},{ "$replaceRoot": { "newRoot": { "$mergeObjects": ["$product", { quantity: "$quantity" }]} } },{$project:{"productDetail":0}},{$sort:{"quantity":1}}])
            return {status: 200,message: "get products success !", data: products};
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
    static async getTopSellProduct(){
        try {
            const orders = await Order.aggregate([{$match:{}},{$project:{listOrderDetail:1}} ,{$unwind:"$listOrderDetail"}, {$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product",totalQuantity:{$sum:"$listOrderDetail.quantity"}}},{$sort:{"totalQuantity":-1}},{$lookup:{from:"Product", localField:"_id",foreignField:"_id", as:"product"}},{$unwind:"$product"},{$project:{"_id":0,"totalQuantity":0}}, { "$replaceRoot": { "newRoot": "$product" }  },{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            if(orders){
                return {status: 200,message: "found Order success !", data: orders}
            }
            else
                return {status: 404, message: "Not found Order !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getProductOnSale(){
        try {
            const products = await Product.aggregate([{$match:{discount:{$ne:new ObjectId('62599849f8f6be052f0a901d')}}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            if(products){
                return {status: 200,message: "found Product success !", data: products}
            }
            else
                return {status: 404, message: "Not found Product !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getProductWithSortPoint(){
        try {
            const products = await Product.aggregate([{$sort:{point:-1}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            if(products){
                return {status: 200,message: "found Products success !", data: products}
            }
            else
                return {status: 404, message: "Not found Products !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async filterProduct(optionSort: String, limit: number, page: number, optionPrice?: Array<Number>, optionSizes?: Array<String>, optionColors?: Array<String>, optionRates?: number){
        if(optionPrice){
        }
        if(optionSizes){
            
        }
        if(optionColors){
            
        }
        if(optionRates){
            
        }
        // Tìm mấy cái ở trên, rồi phía dưới thì dùng $in, sau đó sort nhé
        if(optionSort==="price-esc"){

        }
        else if(optionSort==="price-desc"){

        }
        else if(optionSort==="best-selling"){

        }
        else if(optionSort === "new-product"){

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
