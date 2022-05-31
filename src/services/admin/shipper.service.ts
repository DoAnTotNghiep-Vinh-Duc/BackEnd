import { Account } from "../../models/account";
import { Information } from "../../models/information";
import bcrypt from "bcryptjs";
export class ShipperService {
    static async createShipper(account: any, information: any) {
        try {
            const user = await Account.findOne({ email: account.email });
            if(!user){
              const newInformation = await Information.create({
                name: account.name,
                email: account.email,
                phone: account.phone,
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
    
              return {status: 201, message: "Tạo tài khoản người vận chuyển thành công!"} ;
            }
            else{
              return {status: 409, message:"Tài khoản đã tồn tại !"};
            }
          } catch (error) {
            return {status: 500,message:"Something error when register account ! Please try again !", error: error} ;
          }
    }

}
