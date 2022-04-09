import {ColorImage} from "../models/color-image";
export class ColorImageService {
    static async getAllColorImage() {
        try {
            const colorImages = await ColorImage.find();
            return {status: 200, message: "get all Color Image success !", data: colorImages};
        } catch (error) {
            return{status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getColorImageById(colorImageId: String){
        try {
            const colorImage = await ColorImage.findById(colorImageId)
            if(colorImage){
                return {status: 200,message: "found Color Image success !", data: colorImage}
            }
            else
                return {status: 404, message: "Not found Color Image !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async getColorImageByProductId(productId: String){
        try {
            const colorImages = await ColorImage.find({product: productId})
            if(colorImages.length>0){
                return {status: 200,message: "found Color Image success !", data: colorImages}
            }
            else
                return {status: 404, message: "Not found Color Image !"}
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error};
        }
    }

    static async createColorImage(colorImage: any){
        try {
            const newColorImage = new ColorImage(colorImage);
            await newColorImage.save();
            return {status: 201, message: "create Color Image success !", data: newColorImage}
           
        } catch (error) {
            return{status:500,message: "Something went wrong !", error: error};
        }
    }

    static async updateColorImageById(colorImageId: String, newColorImage: any){
        try {
            const colorImage = await ColorImage.findOne({ _id: colorImageId })
            if(colorImage){
                const result = await ColorImage.findByIdAndUpdate(colorImageId, newColorImage);
                return {status: 204, message: "update ColorImage success !", data: result}
            }
            else
                return {status: 404, message: "Not found Color Image !"}
        } catch (error) {
            return {status: 500,message: "Something went wrong !", error: error};
        }
    }
}
