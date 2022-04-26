import {Color} from "../models/color";
export class ColorService {
    static async getAllColor() {
        try {
            const colors = await Color.find();
            return {status: 200, message: "get all Color success !", data: colors};
        } catch (error) {
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getColorById(colorId: String){
        try {

            const color = await Color.findById(colorId).select(['color', 'name'])
            if(color){
                return {status: 200,message: "found Color success !", data: color}
            }
            else
                return {status: 404, message: "Not found Color !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createColor(color: any){
        try {
            const newColor = new Color(color);
            await newColor.save();
            return {status: 201, message: "create Color success !", data: newColor}
           
        } catch (error) {
            return{status:500,message: "Something went wrong !", error: error};
        }
    }

    static async updateColorById(colorId: String, newColor: any){
        try {
            const color = await Color.findOne({ _id: colorId })
            if(color){
                const result = await Color.findByIdAndUpdate(colorId, newColor);
                return {status: 204, message: "update Color success !", data: result}
            }
            else
                return {status: 404, message: "Not found Color !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
