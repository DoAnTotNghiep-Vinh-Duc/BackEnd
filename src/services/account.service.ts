import {Account} from "../models/account";
export class AccountService {
    static async getAllAccountWithOrderQuantity() {
        try {
            const accounts = await Account.aggregate([{ "$lookup": { "from": "Information", "localField": "information", "foreignField": "_id", "as": "information" }},{$unwind:"$information"},{ "$lookup": { "from": "Order", "localField": "_id", "foreignField": "account", "as": "listOrder" }},{$project:{email:1,nameDisplay:1,isVerifyPhone:1,isVerifyAccountWeb:1,avatar:1,typeAccount:1,roleAccount:1,information:1,createdAt:1,updatedAt:1,orderQuantity:{$size:"$listOrder"}}}])
            return {status: 200, message: "get all Acount success !", data: accounts};
        } catch (error) {
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }

}
