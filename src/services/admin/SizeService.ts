const Size = require("../../models/Size")
export class SizeService {
    static async getAllSize(callback: any) {
        try {
            const sizes = await Size.find();
            callback({message: "get all Size success !", data: sizes});
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async getSizeById(sizeId: String, callback: any){
        try {
            const size = await Size.findOne({ _id: sizeId })
            if(size){
                callback({message: "found Size success !", data: size})
            }
            else
                callback({message: "Not found Size !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async createSize(size: any, callback: any){
        try {
            const newSize = new Size(size);
            await newSize.save();
            callback({message: "create Size success !", data: newSize})
           
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async updateSizeById(sizeId: String, newSize: any, callback: any){
        try {
            const size = await Size.findOne({ _id: sizeId })
            if(size){
                const result = await Size.findByIdAndUpdate(sizeId, newSize);
                callback({message: "update Size success !", data: result})
            }
            else
                callback({message: "Not found Size !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }
}
