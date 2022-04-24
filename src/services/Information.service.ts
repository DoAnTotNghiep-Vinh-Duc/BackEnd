import {Information} from "../models/information";
import {Account} from "../models/account"
import {Twilio} from "twilio"
import { ObjectId } from "mongodb";
export class InformationService {

    static async createInformation(information: any){
        try {
            const newInformation = new Information(information);
            await newInformation.save();
            return {status:201, message: "create Information success !", data: newInformation}
           
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async getInformationByAccountId(accountId: String){
        try {
            const account = await Account.findOne({_id: accountId})
            const information = await Information.findOne({_id:account.information});
            return {status: 200,message: "get Information success !", data: information}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async updateInformation(accountId: String, newInformation: any){
        try {
            const account = await Account.findOne({_id: accountId})
            const result = await Information.findByIdAndUpdate(account.information, newInformation);
            return {status: 204,message: "update Information success !", data: result}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async sendSmsOTP(phone: String){
        const accountSid:any = process.env.ACOUNTSID_TWILIO;
        const authToken: any = process.env.TOKEN_TWILIO;
        const serviceId: any = process.env.SERVICESID_TWILIO;
        const client = new Twilio(accountSid, authToken);
        console.log("Phone: ", phone);
        
        try {
            const verification = await client.verify.services(serviceId).verifications.create({ to: `+84${phone}`, channel: "sms" });
            if (verification) return {status: 200, message:"OTP code has been sent successfully"};
            else return {status: 500, message:"can't send otp code"};
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
    
    static async verifyOtpAndUpdateAccount (accountId: String, phone: String, otp: any)  {
        try {
            const accountSid: any = process.env.ACOUNTSID_TWILIO;
            const authToken: any = process.env.TOKEN_TWILIO;
            const serviceId: any = process.env.SERVICESID_TWILIO;
            const client = new Twilio(accountSid, authToken);
            const verification_check = await client.verify.services(serviceId).verificationChecks.create({ to: `+84${phone}`, code: otp });
            console.log(verification_check);
            if (verification_check.valid) {
            console.log("Verify phone success");
            console.log("accounid: ", accountId);
            
            const account = await Account.findOne({_id: new ObjectId(`${accountId}`)});
            account.isVerifyPhone = true;
            await account.save()
            console.log("account", account);
            
            const information = await Information.findOne({_id: account.information});
            information.phone = phone;
            await information.save();
            console.log("information: ", information);
            
            return {status: 201, message:"verify otp success !"};
          } else {
            return {status: 400, message:"wrong code !"};
          }
        } catch (error) {
          console.log(error);
          return {status: 500,message:"Something went wrong !"};
        }
      };
}
