import {Information} from "../models/information";
export class InformationService {
    // static async getAllInformation(callback: any) {
    //     try {
    //         const Informations = await Information.find();
    //         callback({message: "get all Information success !", data: Informations});
    //     } catch (error) {
    //         callback({message: "Something went wrong !", error: error});
    //     }
    // }

    // static async getInformationById(InformationId: String, callback: any){
    //     try {
    //         const Information = await Information.findOne({ _id: InformationId })
    //         if(Information){
    //             callback({message: "found Information success !", data: Information})
    //         }
    //         else
    //             callback({message: "Not found Information !"})
    //     } catch (error) {
    //         callback({message: "Something went wrong !", error: error});
    //     }
    // }

    static async createInformation(information: any){
        try {
            const newInformation = new Information(information);
            await newInformation.save();
            return {status:201, message: "create Information success !", data: newInformation}
           
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }

    static async updateInformationById(informationId: String, newInformation: any){
        try {
            const information = await Information.findOne({ _id: informationId })
            if(information){
                const result = await Information.findByIdAndUpdate(informationId, newInformation);
                return {status: 204,message: "update Information success !", data: result}
            }
            else
                return {status: 404,message: "Not found Information !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
