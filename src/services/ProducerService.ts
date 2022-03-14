import { ConnectDatabase } from "../config/database/database";
const Producer = require("../models/Producer")
export class ProducerService {
    static async getAllProducer(callback: any) {
        try {
            const producers = await Producer.find();
            callback({message: "get all producer success !", data: producers});
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async getProducerById(producerId: String, callback: any){
        try {
            const producer = await Producer.findOne({ _id: producerId })
            if(producer){
                callback({message: "found producer success !", data: producer})
            }
            else
                callback({message: "Not found producer !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }
}
