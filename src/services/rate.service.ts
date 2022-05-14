import { ObjectId } from "mongodb";
import { Product } from "../models/product";
import {Rate} from "../models/rate";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from 'multer-s3';
import fs from "fs";
import { v4 as uuid } from "uuid";

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
            const rateAndCount = await Rate.aggregate([ {"$group" : {_id:"$point", count:{$sum:1}}}, {$sort:{_id:-1}} ])
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
            return{status: 500, message: "Something went wrong !", error: error};
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
