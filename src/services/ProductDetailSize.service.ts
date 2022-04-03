import { ProductDetailSize } from "../models/ProductDetailSize";
export class ProductDetailSizeService {

    static async getProductDetailSizeByProductDetailId(productDetailId: String, callback: any){
        try {
            const productDetailSizes = await ProductDetailSize.find({ productDetail: productDetailId })
            if(productDetailSizes.length>0){
                callback({message: "found Product Detail Size success !", data: productDetailSizes})
            }
            else
                callback({message: "Not found Product Detail Size with product detail id: !"+productDetailId})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async createProductDetailSize(productDetailSize: any, callback: any){
        try {
            const newProductDetailSize = new ProductDetailSize(productDetailSize);
            await newProductDetailSize.save();
            callback({message: "create Product Detail Size success !", data: newProductDetailSize})
           
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }

    static async updateProductDetailSizeById(productDetailSizeId: String, newProductDetailSize: any, callback: any){
        try {
            const productDetailSize = await ProductDetailSize.findOne({ _id: productDetailSizeId })
            if(productDetailSize){
                const result = await ProductDetailSize.findByIdAndUpdate(productDetailSizeId, newProductDetailSize);
                callback({message: "update Product Detail Size success !", data: result})
            }
            else
                callback({message: "Not found Product Size!"})
        } catch (error) {
            callback({message: "Something went wrong !", error: error});
        }
    }
}
