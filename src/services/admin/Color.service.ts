import {Color} from "../../models/color";
export class ColorService {
    static async getAllColor(callback: any) {
        try {
            const colors = await Color.find();
            callback({message: "get all Color success !", data: colors});
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async getColorById(colorId: String, callback: any){
        try {
            const color = await Color.findOne({ _id: colorId })
            if(color){
                callback({message: "found Color success !", data: color})
            }
            else
                callback({message: "Not found Color !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async createColor(color: any, callback: any){
        try {
            const newColor = new Color(color);
            await newColor.save();
            callback({message: "create Color success !", data: newColor})
           
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async updateColorById(colorId: String, newColor: any, callback: any){
        try {
            const color = await Color.findOne({ _id: colorId })
            if(color){
                const result = await Color.findByIdAndUpdate(colorId, newColor);
                callback({message: "update Color success !", data: result})
            }
            else
                callback({message: "Not found Color !"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }
}
