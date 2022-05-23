import { ObjectId } from "mongodb";
import { Product } from "../models/product";
import {Rate} from "../models/rate";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { Order } from "../models/order";
import { RedisCache } from "../config/redis-cache";

export class RateService {
    static async uploadImage(uploadFile: any){
        try {          
            console.log("uploadFile",uploadFile);
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
                let params: any = {
                    Body: uploadFile[i].buffer,
                    Bucket: `${process.env.AWS_BUCKET_NAME}`,
                    Key: `${filePath}`,
                    ACL: "public-read",
                    ContentType: uploadFile[i].mimetype,
                };
                
                let s3Response = await s3.upload(params).promise();
                listResponse.push(s3Response)
            }
            
            return{status: 201, message: "Upload success????????????????????// !",data:listResponse };
        } catch (error) {
            console.log("error:", error);
            
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getAllRateProduct(productId: String) {
        try {
            const key = `RateService_getAllRateProduct(productId:${productId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Rate success !", data: JSON.parse(dataCache)};
            }
            const rates = await Rate.aggregate([{$match:{product:new ObjectId(`${productId}`)}},{$lookup:{from:"Account", localField:"account",foreignField:"_id", as:"account"}},{$unwind:"$account"}])
            const rateAndCount = await Rate.aggregate([{$match:{product:new ObjectId(`${productId}`)}}, {"$group" : {_id:"$point", count:{$sum:1}}}, {$sort:{_id:-1}} ])
            console.log("rateAndCount",rateAndCount);
            
            for (let index = 5; index >0; index--) {
                console.log(index,rateAndCount[5-index]);
                
                if(!rateAndCount[5-index]||index.toString()!==rateAndCount[5-index]._id.toString()){
                    rateAndCount.splice(5-index,0,{
                        _id:index.toString(),
                        count:0
                    })
                    // rateAndCount.push({
                    //     _id:index.toString(),
                    //     count:0
                    // })
                }
                
            }
            const numberVoteAndtotalRate = await Product.findOne({_id:new ObjectId(`${productId}`)},{voted:1, point:1, _id:0})
            let ratePercent: Array<any> = [];
            for (let index = 0; index < rateAndCount.length; index++) {
                ratePercent.push({
                    "rate":rateAndCount[index]._id,
                    "percent":rateAndCount[index].count/numberVoteAndtotalRate.voted*100
                })
            }
            await RedisCache.setCache(key, JSON.stringify({rates, rateAndCount, ratePercent}), 60*5);
            return {status: 200, message: "get all rates product success !", data: {rates, rateAndCount, ratePercent}};
        } catch (error) {
            console.log(error);
            
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getProductForRateInOrder(accountId: String, orderId: String) {
        try {
            const key = `RateService_getProductForRateInOrder(accountId:${accountId},orderId:${orderId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Rate success !", data: JSON.parse(dataCache)};
            }
            const order = await Order.findOne({_id:new ObjectId(`${orderId}`)})
            if(order.status==="DONE"){
                const productNeedRate = await Order.aggregate([{$match:{$and:[{_id:new ObjectId(`${orderId}`)},{account:new ObjectId(`${accountId}`)}]}},{$unwind:"$listOrderDetail"},{$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product"}}])
                // Lấy product đã được đánh giá
                let convertProductNeedRate = []
                for (let index = 0; index < productNeedRate.length; index++) {
                    convertProductNeedRate.push(productNeedRate[index]._id);
                }
                console.log("convertProductNeedRate",convertProductNeedRate);
                
                const productRated = await Rate.aggregate([{$match:{$and:[{product:{$in:convertProductNeedRate}},{account:new ObjectId(`${accountId}`)}]}},{$project:{product:1}}]);
                let convertProductRated: any[] = []
                for (let index = 0; index < productRated.length; index++) {
                    convertProductRated.push(productRated[index].product);
                }
                console.log("convertProductRated",convertProductRated);
                
                // let productCanRate = convertProductNeedRate.filter(function(obj: any) { return convertProductRated.indexOf(obj) == -1; });
                let productCanRate: any[] = [];
                for(let i = 0; i < convertProductNeedRate.length; i++){
                    let found = false;

                    for(let j = 0; j < convertProductRated.length; j++){ // j < is missed;
                        if(convertProductNeedRate[i].toString() === convertProductRated[j].toString()){
                        found = true;
                        break; 
                    }
                    }
                    if(found == false){
                        productCanRate.push(convertProductNeedRate[i]);
                    }
                }
                console.log("productCanRate",productCanRate);
                const objProductCanRate = await Product.aggregate([{$match:{_id:{$in:productCanRate}}}])
                await RedisCache.setCache(key, JSON.stringify(objProductCanRate), 60*5);
                return {status: 200, message:"Get product can rate success", data: objProductCanRate}
            }
            else{
                return {status:403, message:"order need to be done !"};
            }
        } catch (error) {
            console.log(error);
            
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getRateByAccountAndProduct(accountId: String,productId: String){
        try {

            const rate = await Rate.findOne({account: new ObjectId(`${accountId}`), product: new ObjectId(`${productId}`)}).populate("Account")
            if(rate){
                return {status: 200,message: "found Rate success !", data: rate}
            }
            else
                return {status: 404, message: "Not found Rate !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createRate(accountId: String,uploadFile:any, rateInfo: any){
        try {
            const rate = await Rate.findOne({account:new ObjectId(`${accountId}`), product:new ObjectId(`${rateInfo.productId}`)})
            if(rate){
                return {status: 400, message:"This product has been rated"}
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

            const tmpRate = {
                account:new ObjectId(`${accountId}`),
                product: new ObjectId(`${rateInfo.productId}`),
                point: rateInfo.point,
                content: rateInfo?.content
            }
            const newRate = new Rate(tmpRate);
            for (let index = 0; index < listResponse.length; index++) {
                newRate.image.push(listResponse[index].url);
            }
            console.log(newRate);
            
            await newRate.save();
            const product = await Product.findOne({_id: new ObjectId(`${rateInfo.productId}`)})
            const currentPoint = product.point;
            const currentVoted = product.voted;
            product.point = (Math.round(currentPoint*currentVoted)+rateInfo.point)/(currentVoted+1)
            product.voted+=1;
            await product.save();
            const keysRate = await RedisCache.getKeys(`RateService*`);
            await RedisCache.delKeys(keysRate);
            return {status: 201, message: "create Rate success !", data: newRate}
           
        } catch (error) {
            console.log(error);
            
            return{status:500,message: "Something went wrong !", error: error};
        }
    }

    static async updateRateProduct(userId:String, newRate: any, uploadFile:any){
        try {
            const rate = await Rate.findOne({_id: new ObjectId(`${newRate.rateId}`), account:new ObjectId(`${userId}`)})
            console.log(rate);
            
            if(!rate){
                return {status:404, message:"Not found rate"}
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
                    url: s3Response.Location
                })
            }

            const oldPoint =Number.parseInt(rate.point) ;
            const product = await Product.findOne({_id:rate.product})
            console.log("product",product);
            
            console.log("Math.round(product.point*product.voted)",Math.round(product.point*product.voted));
            console.log("(oldPoint-Number.parseInt(newRate.point))",(oldPoint-Number.parseInt(newRate.point)));
            console.log("product.voted",product.voted);
            
            console.log("point",(Math.round(product.point*product.voted)-(oldPoint-Number.parseInt(newRate.point)))/product.voted);
            
            product.point = (Math.round(product.point*product.voted)-(oldPoint-Number.parseInt(newRate.point)))/product.voted;
            await product.save()
            
            while (rate.image.length>0) {
                rate.image.pop();
            }
            console.log(newRate?.image);
            
            for (let index = 0; index <  newRate?.image.length; index++) {
                rate.image.push(newRate?.image[index].url)     
            }
            for (let index = 0; index < listResponse.length; index++) {
                rate.image.push(listResponse[index].url)
            }
            rate.point = newRate.point,
            rate.content = newRate?.content,
            await rate.save()
            const keysRate = await RedisCache.getKeys(`RateService*`);
            await RedisCache.delKeys(keysRate);
            return {status: 204, message: "update Rate success !", data: rate}
        } catch (error) {
            console.log(error);
            
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getAllRateByAccountId(accountId: String) {
        try {
            const key = `RateService_getAllRateByAccountId(accountId:${accountId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Rate success !", data: JSON.parse(dataCache)};
            }
            
            const rates = await Rate.aggregate([{$match:{account: new ObjectId(`${accountId}`)}},{$lookup:{from:"Product", localField:"product",foreignField:"_id", as:"product"}},{$unwind:"$product"}])
            await RedisCache.setCache(key, JSON.stringify(rates), 60*5);
            return {status: 200, message:"get rate by account success !", data:rates}
        } catch (error) {
            console.log(error);
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getRateByRateId(accountId: String, rateId: String) {
        try {
            const key = `RateService_getRateByRateId(accountId:${accountId},rateId:${rateId})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "found Rate success !", data: JSON.parse(dataCache)};
            }
            
            const rates = await Rate.aggregate([{$match:{account: new ObjectId(`${accountId}`), _id:new ObjectId(`${rateId}`)}},{$lookup:{from:"Product", localField:"product",foreignField:"_id", as:"product"}},{$unwind:"$product"}])
            await RedisCache.setCache(key, JSON.stringify(rates), 60*5);
            return {status: 200, message:"get rate by account success !", data:rates}
        } catch (error) {
            console.log(error);
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }
}
