import { Account } from "../../models/account";
import { Information } from "../../models/information";
import bcrypt from "bcryptjs";
import { RedisCache } from "../../config/redis-cache";
export class ShipperService {
    static async createShipper(account: any, information: any) {
        try {
            const user = await Account.findOne({ email: account.email });
            if(!user){
              const newInformation = await Information.create({
                name: information.name,
                email: account.email,
                phone: information.phone,
                avatar: "https://play-lh.googleusercontent.com/NqAyU0vJMDdXNyVjSDs4c0L8E_47YoCca8U5MNzHAXkkGJN0tcuIByBD3IkSLGWB_w",
                city:information.city,
                district:information.district,
                ward:information.ward,
                street:information.street
              })
              // Generate a salt
              const salt = await bcrypt.genSalt(10);
              // Generate a password hash (salt + hash)
              const passwordHashed = await bcrypt.hash(account.password, salt);
              // Re-assign password hashed
              const newAccount = new Account({
                email: account.email,
                password: passwordHashed,
                nameDisplay: information.name,
                isVerifyPhone: true,
                information: newInformation._id,
                isVerifyAccountWeb:true,
                roleAccount: 'Shipper'
              })
              await newAccount.save();
              await RedisCache.delCache(`getAllShipperWithOrderQuantity`)
              return {status: 201, message: "Tạo tài khoản người vận chuyển thành công!"} ;
            }
            else{
              return {status: 409, message:"Tài khoản đã tồn tại !"};
            }
          } catch (error) {
            return {status: 500,message:"Something error when register account ! Please try again !", error: error} ;
          }
    }
    static async getAllShipperWithOrderQuantity(){
      try {
          const key = `getAllShipperWithOrderQuantity`;
          const dataCache = await RedisCache.getCache(key);
          if(dataCache){
              return {status: 200,message: "get all Account success !", data: JSON.parse(dataCache)};
          }
          const accounts = await Account.aggregate([{$match:{roleAccount:"Shipper"}},{ "$lookup": { "from": "Information", "localField": "information", "foreignField": "_id", "as": "information" }},{$unwind:"$information"},{ "$lookup": { "from": "Order", "localField": "_id", "foreignField": "shipper", "as": "listOrder" }},{$project:{email:1,nameDisplay:1,isVerifyPhone:1,isVerifyAccountWeb:1,typeAccount:1,roleAccount:1,information:1,createdAt:1,updatedAt:1,status:1,orderQuantity:{$size:"$listOrder"}}},{$sort:{createdAt:-1}}])
          await RedisCache.setCache(key, JSON.stringify(accounts), 60*5);
          return {status: 200, message: "get all shipper success !", data: accounts};
      } catch (error) {
          return{status: 500, message: "Something went wrong !", error: error};
      }
  }
}
