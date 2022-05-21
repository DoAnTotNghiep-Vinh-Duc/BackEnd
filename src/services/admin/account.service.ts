import {Account} from "../../models/account";
import { RedisCache } from "../../config/redis-cache";
import { ObjectId } from "mongodb";
export class AccountService {
    static async getAllAccountWithOrderQuantity() {
        try {
            const key = `getAllAccountWithOrderQuantity`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get all Account success !", data: JSON.parse(dataCache)};
            }
            const accounts = await Account.aggregate([{ "$lookup": { "from": "Information", "localField": "information", "foreignField": "_id", "as": "information" }},{$unwind:"$information"},{ "$lookup": { "from": "Order", "localField": "_id", "foreignField": "account", "as": "listOrder" }},{$project:{email:1,nameDisplay:1,isVerifyPhone:1,isVerifyAccountWeb:1,typeAccount:1,roleAccount:1,information:1,createdAt:1,updatedAt:1,status:1,orderQuantity:{$size:"$listOrder"}}}])
            await RedisCache.setCache(key, JSON.stringify(accounts), 60*5);
            return {status: 200, message: "get all Account success !", data: accounts};
        } catch (error) {
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }
    static async filterAccountWithOrderQuantity(keySearch?:String, nameSort?:String, typeSort?:String){
        try {
const key = `getAllAccountWithOrderQuantity(keySearch?:${keySearch},nameSort?:${nameSort},typeSort?:${typeSort})`;
            const dataCache = await RedisCache.getCache(key);
            if(dataCache){
                return {status: 200,message: "get all Account success !", data: JSON.parse(dataCache)};
            }
            let query: Array<any> = [];
            query.push({ "$lookup": { "from": "Information", "localField": "information", "foreignField": "_id", "as": "information" }});
            query.push({$unwind:"$information"});
            query.push({ "$lookup": { "from": "Order", "localField": "_id", "foreignField": "account", "as": "listOrder" }});
            query.push({$project:{email:1,nameDisplay:1,isVerifyPhone:1,isVerifyAccountWeb:1,typeAccount:1,roleAccount:1,information:1,createdAt:1,updatedAt:1,status:1,orderQuantity:{$size:"$listOrder"}}});

            if(keySearch){
                let arr = keySearch.split(" ");
                let keySearchs = [];
                for(let i =0;i<arr.length;i++){
                    if(arr[i]!==" "&&arr[i].trim().length>0){
                        keySearchs.push({"information.name":{"$regex":arr[i].toLowerCase(),$options:'i'}});
                    }
                }
                console.log(keySearchs);
                let queryKeySearch1 = {$match:{$or:keySearchs}};
                query.push(queryKeySearch1);
            }
            if(nameSort==="NAME"){
                if(typeSort==="ASC"){
                    query.push({$sort:{"information.name":1}})
                }
                else{
                    query.push({$sort:{"information.name":-1}})
                }
            }
            if(nameSort==="PHONE"){
                if(typeSort==="ASC"){
                    query.push({$sort:{"information.phone":1}})
                }
                else{
                    query.push({$sort:{"information.phone":-1}})
                }
            }
            if(nameSort==="NUMBERPURCHASES"){
                if(typeSort==="ASC"){
                    query.push({$sort:{"orderQuantity":1}})
                }
                else{
                    query.push({$sort:{"orderQuantity":-1}})
                }
            }
            const accounts = await Account.aggregate(query);
            await RedisCache.setCache(key, JSON.stringify(accounts), 60*5);
            return {status: 200, message: "filter Account success !", data: accounts};
        } catch (error) {
            console.log(error);
            return{status: 500, message: "Something went wrong !", error: error};
        }
        
    }

    static async closeAccount(accountId: String){
        try {
            await Account.updateOne({_id:new ObjectId(`${accountId}`)},{$set:{status:"CLOSED"}})
            await RedisCache.delCache(`${accountId}`);
            await RedisCache.delCache(`getAllAccountWithOrderQuantity`);
            return {status: 200, message: "close account success !"};
        } catch (error) {
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async activeAccount(accountId: String){
        try {
            await Account.updateOne({_id:new ObjectId(`${accountId}`)},{$set:{status:"ACTIVE"}})
            await RedisCache.delCache(`${accountId}`);
            await RedisCache.delCache(`getAllAccountWithOrderQuantity`);
            return {status: 200, message: "active account success !"};
        } catch (error) {
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }
}
