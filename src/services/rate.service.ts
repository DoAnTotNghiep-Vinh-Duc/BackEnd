import { ObjectId } from "mongodb";
import { Product } from "../models/product";
import {Rate} from "../models/rate";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from 'multer-s3';
import fs from "fs";
import { v4 as uuid } from "uuid";
import { Order } from "../models/order";

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
            return {status: 200, message: "get all rates product success !", data: {rates, rateAndCount, ratePercent}};
        } catch (error) {
            console.log(error);
            
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }
    static async getProductForRateInOrder(accountId: String, orderId: String) {
        try {
            const order = await Order.findOne({_id:new ObjectId(`${orderId}`)})
            if(order.status==="DONE"){
                const productNeedRate = await Order.aggregate([{$match:{$and:[{_id:new ObjectId(`${orderId}`)},{account:new ObjectId(`${accountId}`)}]}},{$unwind:"$listOrderDetail"},{$lookup:{from:"ProductDetail", localField:"listOrderDetail.productDetail",foreignField:"_id", as:"listOrderDetail.productDetail"}},{$unwind:"$listOrderDetail.productDetail"},{$group:{"_id":"$listOrderDetail.productDetail.product"}}])
                // Lấy product đã được đánh giá
                let convertProductNeedRate = []
                for (let index = 0; index < productNeedRate.length; index++) {
                    convertProductNeedRate.push(productNeedRate[index]._id);
                }
                console.log("convertProductNeedRate",convertProductNeedRate);
                
                const productRated = await Rate.aggregate([{$match:{$and:[{product:{$in:convertProductNeedRate}},{account:new ObjectId(`${accountId}`)}]}},{$project:{_id:1}}]);
                let convertProductRated: any[] = []
                for (let index = 0; index < productRated.length; index++) {
                    convertProductRated.push(productRated[index]._id);
                }
                console.log("convertProductRated",convertProductRated);
                
                let productCanRate = convertProductNeedRate.filter(function(obj: any) { return convertProductRated.indexOf(obj) == -1; });
                console.log("productCanRate",productCanRate);
                return {status: 200, message:"Get product can rate success", data: productCanRate}
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

    static async createRate(accountId: String, productId: String,rate: any){
        try {
            const tmpRate = {
                account:new ObjectId(`${accountId}`),
                product: new ObjectId(`${productId}`),
                point: rate.point,
                content: rate?.content,
                image: rate?.image
            }
            const newRate = new Rate(tmpRate);
            await newRate.save();
            const product = await Product.findOne({_id: new ObjectId(`${productId}`)})
            const currentPoint = product.point;
            const currentVoted = product.voted;
            product.point = (Math.round(currentPoint*currentVoted)+rate.point)/(currentVoted+1)
            product.voted+=1;
            await product.save();
            return {status: 201, message: "create Rate success !", data: newRate}
           
        } catch (error) {
            return{status:500,message: "Something went wrong !", error: error};
        }
    }

    static async updateRateProduct(accountId: String,productId: String, newRate: any){
        try {
            const rate = await Rate.findOne({account: new ObjectId(`${accountId}`), product: new ObjectId(`${productId}`)})
            if(rate){
                const oldPoint = rate.point;
                const product = await Product.findOne({_id:new ObjectId(`${productId}`)})
                product.point = (Math.round(product.point*product.rated)-(oldPoint-newRate.point))/product.rated;
                await product.save()
                rate.point = newRate.point,
                rate.content = newRate?.content,
                rate.image = newRate?.image
                await rate.save()
                return {status: 204, message: "update Rate success !", data: rate}
            }
            else
                return {status: 404, message: "Not found Rate !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
