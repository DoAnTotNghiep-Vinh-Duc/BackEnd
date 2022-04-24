import { ObjectId } from "mongodb";
import { Product } from "../models/product";
import {Rate} from "../models/rate";
export class RateService {
    static async getAllRateProduct(productId: String) {
        try {
            const rates = await Rate.find({product:new ObjectId(`${productId}`)}).populate("Account");
            return {status: 200, message: "get all rates product success !", data: rates};
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
