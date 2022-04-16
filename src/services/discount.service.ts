import {Discount} from "../models/discount";
export class DiscountService {

    static async getAllDiscount(){
        try {
            const discount = await Discount.find()
            if(discount){
                return {status: 200,message: "found Discount success !", data: discount}
            }
            else
                return {status: 404, message: "Not found Discount !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createDiscount(discount: any){
        try {
            const newDiscount = new Discount(discount);
            await newDiscount.save();
            return {status: 201, message: "create Discount success !", data: newDiscount}
           
        } catch (error) {
            return{status:500,message: "Something went wrong !", error: error};
        }
    }
}
