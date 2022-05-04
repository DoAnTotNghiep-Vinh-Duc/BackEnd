import { Product } from "../models/product";
import { ProductDetail } from "../models/product-detail";
import { RedisCache } from "../config/redis-cache";
import { Discount } from "../models/discount";
import { TypeProduct } from "../models/type-product";
import { ObjectId } from "mongodb";
import { Order } from "../models/order";
import {Supplier} from "../models/supplier"
import { Color } from "../models/color";
import {createClient} from 'redis';
import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
const subscribe = createClient({
    url: `redis://127.0.0.1:6379`,
});
subscribe.psubscribe("__keyevent@0__:expired", (message: any, channel: any) => {
    console.log(message, channel); // 'message', 'channel'
  });
subscribe.on('pmessage', async (pattern: any, channel: any, message: any) => {
    if(message.toString().split('_')[0]==="discount"){
        console.log("discount "+ message.toString().split('_')[1]+ " expire");
        const discountId = message.toString().split('_')[1];
        await Product.updateMany({'discount': new ObjectId(`${discountId}`)},{$set:{'discount':new ObjectId('62599849f8f6be052f0a901d')}})
    }
})
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

    static async getProductWithNameFind(nameFind: String){
        try {
            let arr = nameFind.split(" ");
            let query = [];
            for(let i =0;i<arr.length;i++){
                if(arr[i]!==" "){
                    query.push({"name":{"$regex":arr[i].toLowerCase()}});
                }
            }
            console.log(query);
            
            const products = await Product.aggregate([{$match:{$or:query}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            if(products){
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
            let query = [];
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
            if(optionSort==="price-asc"){
                const data = await Product.aggregate([{$match:{"_id":{$in:finalArray}}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$project:{name: 1,description:1,status:1,typeProducts:1,images:1,supplier:1,discount:1,price:1,voted:1,point:1,created_at:1,updated_at:1,discountPrice:{$multiply:["$price",{$subtract:[1,"$discount.percentDiscount"]}]}}},{$sort:{discountPrice:1}},{$project:{discountPrice:0}}])
                return {status: 200,message: "sort Products success !", data: data}
            }
            else if(optionSort==="price-desc"){
                const data = await Product.aggregate([{$match:{"_id":{$in:finalArray}}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$project:{name: 1,description:1,status:1,typeProducts:1,images:1,supplier:1,discount:1,price:1,voted:1,point:1,created_at:1,updated_at:1,discountPrice:{$multiply:["$price",{$subtract:[1,"$discount.percentDiscount"]}]}}},{$sort:{discountPrice:-1}},{$project:{discountPrice:0}}])
                return {status: 200,message: "sort Products success !", data: data}
            }
            else if(optionSort==="best-selling"){
                const data = await Order.aggregate([{$match:{}},{$project:{listOrderDetail:1}} ,{$unwind:"$listOrderDetail"}, {$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product",totalQuantity:{$sum:"$listOrderDetail.quantity"}}},{$sort:{"totalQuantity":-1}},{$lookup:{from:"Product", localField:"_id",foreignField:"_id", as:"product"}},{$unwind:"$product"},{$project:{"_id":0,"totalQuantity":0}}, { "$replaceRoot": { "newRoot": "$product" }  },{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$match:{"_id":{$in:finalArray}}}]);
                return {status: 200,message: "sort Products success !", data: data}
            }
            else if(optionSort === "new-product"){
                const data =await Product.aggregate([{$match:{"_id":{$in:finalArray}}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}}]);
                return {status: 200,message: "sort Products success !", data: data}
            }
            else{
                return {status: 400,message: "error !"}
            }
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
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
    

    static async createProduct(uploadFile: any,product: any,productDetails: Array<any>){
        try {
            if(!checkCanCreateProduct(productDetails)){
                return {status:400,message: "can not create product !"};
            }
            const s3 = new AWS.S3({
                accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
                secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
                region:"us-east-1"
            });
            let listResponse = [];
            for(let i = 0; i< uploadFile.length; i++){
                let ul = uploadFile[i].originalname.split(".");
                let filesTypes = ul[ul.length - 1];
                let filePath = `${uuid() + Date.now().toString()}.${filesTypes}`;
                console.log("filePath", filePath);
                
                let params: any = {
                    Body: uploadFile[i].buffer,
                    Bucket: `${process.env.AWS_BUCKET_NAME}`,
                    Key: `${filePath}`,
                    ACL: "public-read",
                    ContentType: uploadFile[i].mimetype,
                };
                let s3Response = await s3.upload(params).promise();
                console.log("s3Response",s3Response);
                
                listResponse.push({
                    idColor: uploadFile[i].fieldname,
                    url: s3Response.Location
                })
            }

            const supplier = await Supplier.findOne({_id: product.supplier});
            product.supplier = supplier._id;
            const finalTypeProducts = product.typeProducts.map(function (obj: any) {
                return new ObjectId(`${obj}`);
            });
            product.typeProducts = finalTypeProducts;
            const discount = await Discount.findOne({_id: product.discount});
            product.discount = discount._id
            
            const listObjectIdProductDetail: Array<any> = [];
            const newProduct = new Product(product);
            await newProduct.save();

            for(let i =0;i< productDetails.length;i++){
                const color = await Color.findOne({_id:productDetails[i].color})
                listResponse.forEach(async element => {
                    if(color._id.toString()===element.idColor){
                        let details = productDetails[i].details;
                        for(let j=0;j<details.length;j++){
                            const productDetail = {
                                product: newProduct._id,
                                image: element.url.toString(),
                                color: color._id,
                                size: details[j].size,
                                quantity:Number.parseInt(details[j].quantity) 
                            }
                            const newProductDetail = new ProductDetail(productDetail)
                            await newProductDetail.save();
                            listObjectIdProductDetail.push(newProductDetail._id)
                        }
                    }
                });
                
                
            }
            await Product.findOneAndUpdate({_id: newProduct._id},{listProductDetail: listObjectIdProductDetail},{new: true});
            return {status:201,message: "create Product success !", data: newProduct};
           
        } catch (error) {
            console.log(error);
            
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




function checkCanCreateProduct(productDetails: any[]) {
    let result: Boolean = true;
    // Kiểm tra có trùng màu không
    for(let i = 0; i< productDetails.length; i++){
        for(let j = i+1; j< productDetails.length;j++){
            if(productDetails[i].color===productDetails[j].color){
                result = false;
                break;
            }
        }
        if(result===false){
            break;
        }
        // Kiểm tra có trùng size trong 1 màu không
        let details = productDetails[i].details;
        
        for(let k = 0; k< details.length; k++){
            if(Number.parseInt(details[k].quantity)<0){
                result = false;
                break;
            }
            for (let p = k+1; p<details.length; p++){
                console.log("details k: ",details[k].size);
                console.log("details p: ",details[p].size);
                if(details[k].size===details[p].size){
                    result = false;
                    break;
                }
            }
        }
    }
    return result;
}

