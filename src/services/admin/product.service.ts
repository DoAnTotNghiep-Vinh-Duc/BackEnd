import { Product } from "../../models/product";
import { ProductDetail } from "../../models/product-detail";
import { RedisCache } from "../../config/redis-cache";
import { Discount } from "../../models/discount";
import { TypeProduct } from "../../models/type-product";
import { ObjectId } from "mongodb";
import { Order } from "../../models/order";
import {Supplier} from "../../models/supplier"
import { Color } from "../../models/color";
import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import { CartDetail } from "../../models/cart-detail";
import util from "util";
import { Favorite } from "../../models/favorite";
export class ProductService {
    static async getAllProductAdmin() {
        try {
            const key = `ProductService_getAllProductAdmin`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get all Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$sort:{"name":1}}, {$lookup:{from:"ProductDetail", localField:"_id",foreignField:"product", as:"productDetail"}},{$unwind:"$productDetail"},{$match:{"productDetail.status":{$ne:"DELETE"}}},{"$group": { "_id": "$_id",product:{$first:"$$ROOT"},quantity:{$sum:"$productDetail.quantity"} }},{ "$replaceRoot": { "newRoot": { "$mergeObjects": ["$product", { quantity: "$quantity" }]} } },{$project:{"productDetail":0}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{"name":1}}])
            await RedisCache.setCache(key, JSON.stringify(products), 60*5);
            return {status: 200,message: "get all Product success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
    static async getProductAndDetailByIdAdmin(productId: String){
        try {
            const key: String = `ProductService_getProductAndDetailByIdAdmin(${productId})`
            const data = await RedisCache.getCache(key);
            if(data){
                return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            }
            const products = await Product.aggregate([{$match:{_id:new ObjectId(`${productId}`)}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
            const product = products[0]
            let listProductDetail: any = await ProductDetail.aggregate([{$match:{$and:[{product:new ObjectId(`${productId}`)},{status:{$ne:"DELETE"}}]}},{$lookup:{from:"Color",localField:"color",foreignField:"_id",as:"color"}},{$unwind:"$color"}])
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
    static async getAllProductLimitPageAdmin(page: number, limit: number) {
        try {
            const key = `ProductService_getAllProductLimitPageAdmin(page:${page},limit:${limit})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$sort:{"name":1}}, {$lookup:{from:"ProductDetail", localField:"_id",foreignField:"product", as:"productDetail"}},{$skip:(page-1)*limit},{$limit:limit},{$unwind:"$productDetail"},{$match:{"productDetail.status":{$ne:"DELETE"}}},{"$group": { "_id": "$_id",product:{$first:"$$ROOT"},quantity:{$sum:"$productDetail.quantity"} }},{ "$replaceRoot": { "newRoot": { "$mergeObjects": ["$product", { quantity: "$quantity" }]} } },{$project:{"productDetail":0}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{"name":1}}])
            await RedisCache.setCache(key, JSON.stringify(products), 60*5);
            return {status: 200,message: "get all Product success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
    static async getNewProductAdmin(){
        try {
            const key: String = `ProductService_getNewProductAdmin`
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Product success !", data: JSON.parse(dataCache)}
            }
            const products = await Product.aggregate([{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}}]);
            await RedisCache.setCache(key,JSON.stringify(products),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getProductWithNameTypeAdmin(listType: Array<String>){
        try {
            
            const key: String = `ProductService_getProductWithNameTypeAdmin(listType:${listType})`
            const data = await RedisCache.getCache(key);
            if(data){
                return {status: 200,message: "found Product success !", data: JSON.parse(data)}
            }
            const listTypeProduct = await TypeProduct.aggregate([{$match:{name:{$in:listType}}},{$project:{_id:1}}])
            if(listType.length!==listTypeProduct.length){
                return {status: 404,message: "Not found product !", data: []};
            }
            let convertListType: Array<any> = [];
            for (let index = 0; index < listTypeProduct.length; index++) {
                convertListType.push(listTypeProduct[index]._id);
            }
            const products = await Product.aggregate([{$match:{typeProducts:{$all:convertListType}}},{$match:{status:{$ne:"DELETE"}}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}}])
            await RedisCache.setCache(key,JSON.stringify(products),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
    static async getProductWithNameTypeLimitPageAdmin(listType: Array<String>, page: number, limit: number){
        try {
            
            const key: String = `ProductService_getProductWithNameTypeLimitPageAdmin(listType:${listType},page:${page},limit:${limit})`
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
            const products = await Product.aggregate([{$match:{typeProducts:{$all:convertListType}}}, {$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"},{$sort:{created_at:-1}},{$skip:(page-1)*limit},{$limit:limit}])
            await RedisCache.setCache(key,JSON.stringify(products),60*5)
            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
    static async getTopSellProductAdmin(){
        try {
            const key = `ProductService_getTopSellProductAdmin`;
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

    static async getProductWithSortPointAdmin(){
        try {
            const key = `ProductService_getProductWithSortPointAdmin`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$sort:{point:-1}},{$lookup:{from:"Discount", localField:"discount",foreignField:"_id", as:"discount"}},{$unwind:"$discount"}])
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

    static async getProductLowQuantityAdmin() {
        try {
            const key = `ProductService_getProductLowQuantityAdmin`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get Product success !", data: JSON.parse(dataCache)};
            }
            const products = await Product.aggregate([{$lookup:{from:"ProductDetail", localField:"_id",foreignField:"product", as:"productDetail"}},{$unwind:"$productDetail"},{$match:{"productDetail.status":{$ne:"DELETE"}}},{"$group": { "_id": "$_id",product:{$first:"$$ROOT"},quantity:{$sum:"$productDetail.quantity"} }},{ "$replaceRoot": { "newRoot": { "$mergeObjects": ["$product", { quantity: "$quantity" }]} } },{$project:{"productDetail":0}},{$sort:{"quantity":1}}])
            await RedisCache.setCache(key, JSON.stringify(products), 60*5);

            return {status: 200,message: "get products success !", data: products};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async createProductAdmin(uploadFile: any,product: any,productDetails: Array<any>){
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
            let listImageUrl = [];
            for (let index = 0; index < listResponse.length; index++) {
                listImageUrl.push(listResponse[index].url);
                console.log(listResponse[index].url);
                
            }
            console.log("listImageUrl",listImageUrl);
            
            const supplier = await Supplier.findOne({_id: product.supplier});
            product.supplier = supplier._id;
            const finalTypeProducts = product.typeProducts.map(function (obj: any) {
                return new ObjectId(`${obj}`);
            });
            product.typeProducts = finalTypeProducts;
            const discount = await Discount.findOne({_id: product.discount});
            product.discount = discount._id
            
            product.images = listImageUrl;
            const newProduct = new Product(product);
            await newProduct.save();
            
            const listObjectIdProductDetail: Array<any> = [];
            for(let i =0;i< productDetails.length;i++){
                const color = await Color.findOne({_id:productDetails[i].color})
                let findImage = null;
                for(let index =0; index< listResponse.length;index++){
                    if(color._id.toString()===listResponse[index].idColor){
                        findImage = listResponse[index];
                    }
                }
                if(findImage){
                    let details = productDetails[i].listProductDetail;
                    for(let j=0;j<details.length;j++){
                        const productDetail = {
                            product: newProduct._id,
                            image: findImage.url.toString(),
                            color: color._id,
                            size: details[j].size,
                            quantity:Number.parseInt(details[j].quantity) 
                        }
                        const newProductDetail = new ProductDetail(productDetail)
                        await newProductDetail.save();
                        listObjectIdProductDetail.push(newProductDetail._id)
                    }
                }
                else{
                    let details = productDetails[i].listProductDetail;
                    for(let j=0;j<details.length;j++){
                        const productDetail = {
                            product: newProduct._id,
                            image: "",
                            color: color._id,
                            size: details[j].size,
                            quantity:Number.parseInt(details[j].quantity) 
                        }
                        const newProductDetail = new ProductDetail(productDetail)
                        await newProductDetail.save();
                        listObjectIdProductDetail.push(newProductDetail._id)
                    }
                }
                
                
            }
            // await RedisCache.clearCache();
            const keysProduct = await RedisCache.getKeys(`ProductService*`);
            await RedisCache.delKeys(keysProduct);
            await Product.findOneAndUpdate({_id: newProduct._id},{listProductDetail: listObjectIdProductDetail},{new: true});
            return {status:201,message: "create Product success !", data: newProduct};
           
        } catch (error) {
            console.log(error);
            
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async updateProductByIdAdmin(uploadFile: any, product: any, productDetails: Array<any>){
        try {
            if(!checkCanCreateProduct(productDetails)){
                return {status:400,message: "can not update product !"};
            }
            console.log("pass success !");
            
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
            
            let productNeedUpdate = await Product.findOne({_id: new ObjectId(`${product._id}`)})
            if(productNeedUpdate.price !== product.price){

            }
            if(productNeedUpdate.discount.toString() !== product.discount.toString()){
                
            }
            if(productNeedUpdate){
                productNeedUpdate.name = product.name;
                productNeedUpdate.description = product.description;
                productNeedUpdate.name = product.name;
                productNeedUpdate.status = product.status;
                productNeedUpdate.typeProducts = product.typeProducts;
                productNeedUpdate.suplier = product.suplier;
                productNeedUpdate.discount = product.discount;
                productNeedUpdate.price = product.price;
                while (productNeedUpdate.images.length>0) {
                    productNeedUpdate.images.pop();
                }
                for(let i =0;i< productDetails.length;i++){
                    const color = await Color.findOne({_id:new ObjectId(`${productDetails[i].color}`)})
                    // Nếu bị đổi ảnh
                    if(productDetails[i].image&&Object.keys(productDetails[i].image).length===0){
                        let imageUrl = listResponse.map(async (element)=>{
                            if(color._id.toString()===element.idColor){
                                productNeedUpdate.images.push(element.url);
                                for (let index = 0; index < productDetails[i].listProductDetail.length; index++) {
                                    // Nếu đây là product detail đã tồn tại
                                    if(productDetails[i].listProductDetail[index]._id){
                                        // Nếu product detail bị xóa
                                        if(productDetails[i].listProductDetail[index].status==="DELETE"){
                                            await ProductDetail.findOneAndUpdate({_id:new ObjectId(`${productDetails[i].listProductDetail[index]._id}`)},{$set:{status:"DELETE"}})
                                            // xóa tất cả chi tiết sản phẩm khỏi giỏ hàng
                                            await CartDetail.deleteMany({productDetail:new ObjectId(`${productDetails[i].listProductDetail[index]._id}`)});
                                        }
                                        else{
                                            await ProductDetail.findOneAndUpdate({_id:new ObjectId(`${productDetails[i].listProductDetail[index]._id}`)},{$set:{size:productDetails[i].listProductDetail[index].size, quantity:productDetails[i].listProductDetail[index].quantity, image:element.url}})
                                        }
                                    }
                                    // Nếu đây là product detail mới được thêm vào (Mới thêm thì sẽ không có id)
                                    else{
                                        let newProductDetail = new ProductDetail({
                                            size:productDetails[i].listProductDetail[index].size,
                                            quantity: productDetails[i].listProductDetail[index].quantity,
                                            image:element.url,
                                            product:productNeedUpdate._id,
                                            color:color._id
                                        });
        
                                        await newProductDetail.save();
                                    }
                                }
                            }
                        })
                    }
                    else{
                        for (let index = 0; index < productDetails[i].listProductDetail.length; index++) {
                            // Nếu đây là product detail đã tồn tại
                            productNeedUpdate.images.push(productDetails[i].image)
                            if(productDetails[i].listProductDetail[index]._id){
                                // Nếu product detail bị xóa
                                if(productDetails[i].listProductDetail[index].status==="DELETE"){
                                    await ProductDetail.findOneAndUpdate({_id:new ObjectId(`${productDetails[i].listProductDetail[index]._id}`)},{$set:{status:"DELETE"}})
                                    // xóa tất cả chi tiết sản phẩm khỏi giỏ hàng
                                    await CartDetail.deleteMany({productDetail:new ObjectId(`${productDetails[i].listProductDetail[index]._id}`)});
                                }
                                else{
                                    await ProductDetail.findOneAndUpdate({_id:new ObjectId(`${productDetails[i].listProductDetail[index]._id}`)},{$set:{size:productDetails[i].listProductDetail[index].size, quantity:productDetails[i].listProductDetail[index].quantity}})
                                }
                            }
                            // Nếu đây là product detail mới được thêm vào (Mới thêm thì sẽ không có id)
                            else{
                                let newProductDetail = new ProductDetail({
                                    size:productDetails[i].listProductDetail[index].size,
                                    quantity: productDetails[i].listProductDetail[index].quantity,
                                    image:productDetails[i].image,
                                    product:productNeedUpdate._id,
                                    color:color._id
                                });

                                await newProductDetail.save();
                            }
                        }
                    }
                }
                delKeyRedisWhenChangeProduct();
                await productNeedUpdate.save();
                return {status: 204,message: "update Product success !"};
            }
            else
                return {status: 404,message: "Not found Product !"};
        } catch (error) {
            console.log(error);
            
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async stopSellingProductAdmin(productId: String){
        try {
            await Product.updateOne({_id:new ObjectId(`${productId}`)},{$set:{status:"STOPPSELLING"}})
            let listProductDetail = await ProductDetail.aggregate([{$match:{product:new ObjectId(`${productId}`)}}, {$project:{_id:1}}])
            await ProductDetail.updateMany({product:new ObjectId(`${productId}`)},{$set:{status:"STOPSELLING"}})
            let productDetailsConvert = listProductDetail.map(function(id) {
                return id;
            });
            await CartDetail.deleteMany({productDetail:{$in:productDetailsConvert}, status:"DELETE"})
            await Favorite.updateMany({},{$pull:{"listProduct":new ObjectId(`${productId}`)}})
            // await RedisCache.clearCache();
            delKeyRedisWhenChangeProduct()
            return {status: 200, message:"Delete product success !"};
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async resaleProductAdmin(productId: String){
        try {
            await Product.updateOne({_id:new ObjectId(`${productId}`)},{$set:{status:"ACTIVE"}})
            await ProductDetail.updateMany({product:new ObjectId(`${productId}`)},{$set:{status:"ACTIVE"}})
            const keysProduct = await RedisCache.getKeys(`ProductService*`);
            await RedisCache.delKeys(keysProduct);
            return {status: 200, message:"resale product success !"};
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
}


async function delKeyRedisWhenChangeProduct() {
    const keysCart = await RedisCache.getKeys(`CartService*`);
    await RedisCache.delKeys(keysCart);
    const keysProduct = await RedisCache.getKeys(`ProductService*`);
    await RedisCache.delKeys(keysProduct);
    const keysFavorite = await RedisCache.getKeys(`FavoriteService*`);
    await RedisCache.delKeys(keysFavorite);
}

function checkCanCreateProduct(productDetails: any[]) {
    let result: Boolean = true;
    // Kiểm tra có trùng màu không
    console.log(productDetails);
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
        let details = productDetails[i].listProductDetail;
                
        for(let k = 0; k< details.length; k++){
            if(Number.parseInt(details[k].quantity)<0){
                result = false;
                break;
            }
            for (let p = k+1; p<details.length; p++){
                if(details[k].size===details[p].size){
                    result = false;
                    break;
                }
            }
        }
    }
    
    return result;
}
