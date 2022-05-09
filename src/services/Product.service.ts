import { Product } from "../models/product";
import { ProductDetail } from "../models/product-detail";
import { RedisCache } from "../config/redis-cache";
import { Discount } from "../models/discount";
import { TypeProduct } from "../models/type-product";
import { ObjectId } from "mongodb";
import { Order } from "../models/order";
import {Supplier} from "../models/supplier"
import { Color } from "../models/color";
import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import { Cart } from "../models/cart";
import { CartDetail } from "../models/cart-detail";
import util from "util";
import { Favorite } from "../models/favorite";
export class ProductService {
    static async getAllProduct() {
        try {
            const key = `ProductService_getAllProduct`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get all Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$match:{status:"ACTIVE"}},{$sort:{"name":1}}, {$lookup:{from:"ProductDetail", localField:"_id",foreignField:"product", as:"productDetail"}},{$unwind:"$productDetail"},{$match:{"productDetail.status":"ACTIVE"}},{"$group": { "_id": "$_id",product:{$first:"$$ROOT"},quantity:{$sum:"$productDetail.quantity"} }},{ "$replaceRoot": { "newRoot": { "$mergeObjects": ["$product", { quantity: "$quantity" }]} } },{$project:{"productDetail":0}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{"name":1}}])
            await RedisCache.setCache(key, JSON.stringify(products), 60*5);
            return {status: 200,message: "get all Product success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getAllProductLimitPage(page: number, limit: number) {
        try {
            const key = `ProductService_getAllProductLimitPage(page:${page},limit:${limit})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$match:{status:"ACTIVE"}},{$sort:{"name":1}}, {$lookup:{from:"ProductDetail", localField:"_id",foreignField:"product", as:"productDetail"}},{$skip:(page-1)*limit},{$limit:limit},{$unwind:"$productDetail"},{$match:{"productDetail.status":"ACTIVE"}},{"$group": { "_id": "$_id",product:{$first:"$$ROOT"},quantity:{$sum:"$productDetail.quantity"} }},{ "$replaceRoot": { "newRoot": { "$mergeObjects": ["$product", { quantity: "$quantity" }]} } },{$project:{"productDetail":0}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{"name":1}}])
            await RedisCache.setCache(key, JSON.stringify(products), 60*5);
            return {status: 200,message: "get all Product success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductById(productId: String){
        try {
            const key = `ProductService_getProductById(productId:${productId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$match:{$and:[{_id:new ObjectId(`${productId}`)},{status:"ACTIVE"}]}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            await RedisCache.setCache(key, JSON.stringify(products[0]), 60*5);
            return {status: 200, message: "found Product success", data: products[0]}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getNewProduct(){
        try {
            const key: String = `ProductService_getNewProduct`
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Product success !", data: JSON.parse(dataCache)}
            }
            const products = await Product.aggregate([{$match:{status:"ACTIVE"}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}}]);
            await RedisCache.setCache(key,JSON.stringify(products),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductWithNameType(listType: Array<String>){
        try {
            
            const key: String = `ProductService_getProductWithNameType(listType:${listType})`
            const data = await RedisCache.getCache(key);
            if(data){
                return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            }
            const listTypeProduct = await TypeProduct.aggregate([{$match:{name:{$in:listType}}},{$match:{status:"ACTIVE"}},{$project:{_id:1}}])
            if(listType.length!==listTypeProduct.length){
                return {status: 404,message: "Not found product !", data: []};
            }
            let convertListType: Array<any> = [];
            for (let index = 0; index < listTypeProduct.length; index++) {
                convertListType.push(listTypeProduct[index]._id);
            }
            const products = await Product.aggregate([{$match:{typeProducts:{$all:convertListType}}},{$match:{status:"ACTIVE"}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}}])
            await RedisCache.setCache(key,JSON.stringify(products),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductWithNameTypeLimitPage(listType: Array<String>, page: number, limit: number){
        try {
            
            const key: String = `ProductService_getProductWithNameTypeLimitPage(listType:${listType},page:${page},limit:${limit})`
            const data = await RedisCache.getCache(key);
            if(data){
                return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            }
            const listTypeProduct = await TypeProduct.aggregate([{$match:{name:{$in:listType}}},{$match:{status:"ACTIVE"}},{$project:{_id:1}}])
            if(listType.length!==listTypeProduct.length){
                return {status: 404,message: "Not found type product !", data: []};
            }
            let convertListType: Array<any> = [];
            for (let index = 0; index < listTypeProduct.length; index++) {
                convertListType.push(listTypeProduct[index]._id);
            }
            const products = await Product.aggregate([{$match:{typeProducts:{$all:convertListType}}},{$match:{status:"ACTIVE"}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}},{$skip:(page-1)*limit},{$limit:limit}])
            await RedisCache.setCache(key,JSON.stringify(products),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductAndDetailById(productId: String){
        try {
            const key: String = `ProductService_getProductAndDetailById(${productId})`
            const data = await RedisCache.getCache(key);
            if(data){
                return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            }
            const products = await Product.aggregate([{$match:{$and:[{_id:new ObjectId(`${productId}`)},{status:"ACTIVE"}]}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            const product = products[0]
            console.log("PRODUCT: ", product);
            
            let listProductDetail: any = await ProductDetail.aggregate([{$match:{$and:[{product:new ObjectId(`${productId}`)},{status:"ACTIVE"}]}},{$lookup:{from:"Color",localField:"color",foreignField:"_id",as:"color"}},{$unwind:"$color"}])
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
                await RedisCache.setCache(key,JSON.stringify({product,listProductDetail:arrayOfObj }),60*5)
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
            const key = `ProductService_getTopSellProduct`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            const orders = await Order.aggregate([{$match:{status:{$ne:"CANCELED"}}},{$project:{listOrderDetail:1}} ,{$unwind:"$listOrderDetail"}, {$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product",totalQuantity:{$sum:"$listOrderDetail.quantity"}}},{$sort:{"totalQuantity":-1}},{$lookup:{from:"Product", localField:"_id",foreignField:"_id", as:"product"}},{$unwind:"$product"},{$project:{"_id":0,"totalQuantity":0}}, { "$replaceRoot": { "newRoot": "$product" }  },{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            if(orders){
                await RedisCache.setCache(key,JSON.stringify(orders),60*5)
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
            const key = `ProductService_getProductOnSale`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$match:{$and:[{discount:{$ne:new ObjectId('62599849f8f6be052f0a901d')}},{status:"ACTIVE"}]}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            if(products){
                await RedisCache.setCache(key,JSON.stringify(products),60*5)
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
            const key = `ProductService_getProductWithSortPoint`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$match:{status:"ACTIVE"}},{$sort:{point:-1}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            if(products){
                await RedisCache.setCache(key,JSON.stringify(products),60*5)
                return {status: 200,message: "found Products success !", data: products}
            }
            else
                return {status: 404, message: "Not found Products !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getProductWithNameFind(nameFind: String){
        try {
            const key = `ProductService_getProductWithNameFind(nameFind:${nameFind})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            let arr = nameFind.split(" ");
            let query = [];
            for(let i =0;i<arr.length;i++){
                if(arr[i]!==" "){
                    query.push({"name":{"$regex":arr[i].toLowerCase()}});
                }
            }
            console.log(query);
            
            const products = await Product.aggregate([{$match:{status:"ACTIVE"}},{$match:{$or:query}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            if(products){
                await RedisCache.setCache(key,JSON.stringify(products),60*5)
                return {status: 200,message: "found Products success !", data: products}
            }
            else
                return {status: 404, message: "Not found Products !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async filterProduct(optionSort: String, optionPrice?: Array<Number>, optionSizes?: Array<String>, optionColors?: Array<String>, optionRates?: number){
        try {
            const key = `ProductService_filterProduct(optionSort:${optionSort},optionPrice?:${optionPrice},optionSizes?:${optionSizes},optionColors?:${optionColors}, optionRates?:${optionRates})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            let query = [];
            query.push({$match:{status:"ACTIVE"}})
            query.push({$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}});
            query.push({$unwind:"$discount"});
            if(optionPrice){
                let queryOptionPrice1 = {$project:{discountPrice:{$multiply:["$price",{$subtract:[1,"$discount.percentDiscount"]}]}}};
                let queryOptionPrice2 = {$match:{discountPrice:{$gte:optionPrice[0], $lte:optionPrice[1]}}};
                query.push(queryOptionPrice1);
                query.push(queryOptionPrice2);
            }
            if(optionSizes||optionColors){
                let query1 = {$lookup:{from:"ProductDetail", localField:"_id",foreignField:"product", as:"product"}}
                let query2 = {$unwind:"$product"};
                query.push(query1);
                query.push(query2);
            }
            if(optionSizes){
                let queryOptionSize1 = {$match:{"product.size":{$in:optionSizes}}}
                
                query.push(queryOptionSize1);
            }
            if(optionColors){
                let queryOptionColor1 = {$lookup:{from:"Color", localField:"product.color",foreignField:"_id", as:"product.color"}}
                let queryOptionColor2 = {$unwind:"$product.color"}
                let queryOptionColor3 = {$match:{"product.color.name":{$in:optionColors}}};
                query.push(queryOptionColor1)
                query.push(queryOptionColor2)
                query.push(queryOptionColor3)
            }
            if(optionRates){
                let queryOptionRate1 = {$match:{point:{$gte:optionRates}}};
                query.push(queryOptionRate1);
            }
            let queryGroup = {$group:{"_id":"$_id"}}
            query.push(queryGroup)

            const dataQuery = await Product.aggregate(query);
            const finalArray = dataQuery.map(function (obj) {
                return obj._id;
            });
            console.log(finalArray);
            
            // Tìm mấy cái ở trên, rồi phía dưới thì dùng $in, sau đó sort nhé
            let data: any = null;
            if(optionSort==="price-asc"){
                data = await Product.aggregate([{$match:{"_id":{$in:finalArray}}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$project:{name: 1,description:1,status:1,typeProducts:1,images:1,supplier:1,discount:1,price:1,voted:1,point:1,created_at:1,updated_at:1,discountPrice:{$multiply:["$price",{$subtract:[1,"$discount.percentDiscount"]}]}}},{$sort:{discountPrice:1}},{$project:{discountPrice:0}}])
            }
            else if(optionSort==="price-desc"){
                data = await Product.aggregate([{$match:{"_id":{$in:finalArray}}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$project:{name: 1,description:1,status:1,typeProducts:1,images:1,supplier:1,discount:1,price:1,voted:1,point:1,created_at:1,updated_at:1,discountPrice:{$multiply:["$price",{$subtract:[1,"$discount.percentDiscount"]}]}}},{$sort:{discountPrice:-1}},{$project:{discountPrice:0}}])
            }
            else if(optionSort==="best-selling"){
                data = await Order.aggregate([{$match:{}},{$project:{listOrderDetail:1}} ,{$unwind:"$listOrderDetail"}, {$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product",totalQuantity:{$sum:"$listOrderDetail.quantity"}}},{$sort:{"totalQuantity":-1}},{$lookup:{from:"Product", localField:"_id",foreignField:"_id", as:"product"}},{$unwind:"$product"},{$project:{"_id":0,"totalQuantity":0}}, { "$replaceRoot": { "newRoot": "$product" }  },{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$match:{"_id":{$in:finalArray}}}]);
            }
            else if(optionSort === "new-product"){
                data =await Product.aggregate([{$match:{"_id":{$in:finalArray}}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}}]);
            }
            else{
                return {status: 400,message: "error !"}
            }
            await RedisCache.setCache(key,JSON.stringify(data),60*5)
            return {status: 200,message: "sort Products success !", data: data}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
}
