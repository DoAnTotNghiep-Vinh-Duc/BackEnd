import { ObjectId } from "mongodb";
import { Order } from "../models/order";
import { Account } from "../models/account";
import {Supplier} from "../models/supplier";
export class ShipperService {
    // static async getAllOrderOfShipper(accountId: String) {
    //     try {
    //         const account = await Account.findOne({_id:new ObjectId(`${accountId}`)});
    //         const suppliers = await Supplier.find();
    //         const orders = await Order.aggregate();
    //         return{status: 200,message: "get all supplier success !", data: suppliers};
    //     } catch (error) {
    //         return{status: 500,message: "Something went wrong !", error: error};
    //     }
    // }
}
