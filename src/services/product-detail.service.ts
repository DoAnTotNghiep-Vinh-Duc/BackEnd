import { ProductDetail } from "../models/product-detail";
import { ProductService } from "./product.service";
export class ProductDetailService {
    //Note Chỗ này phải tìm bên product, trả về list object id product detail sau đó mới tìm trong product detail
    static async getProductDetailByProductId(productId: String) {
        try {
            const product = await ProductService.getProductById(productId)
            const productDetails = await ProductDetail.find({ product: productId })
            if (productDetails.length > 0) {
                return {status:200, message: "found Product Size success !", data: productDetails }
            }
            else
                return{status:404, message: "Not found Product Detail with product id: !" + productId }
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error };
        }
    }

    static async getProductDetailById(productDetailId: String) {
        try {
            const productDetail = await ProductDetail.findOne({ _id: productDetailId })
            if (productDetail) {
                return { message: "found Product Size success !", data: productDetail }
            }
            else
                return { message: "Not found Product Detail with id: !" + productDetailId }
        } catch (error) {
            return { message: "Something went wrong !", error: error };
        }
    }

    static async createProductDetail(productDetail: any) {
        try {
            const newProductDetail = new ProductDetail(productDetail);
            await newProductDetail.save();
            return{status: 201, message: "create Product Detail success !", data: newProductDetail }

        } catch (error) {
            return{status: 500, message: "Something went wrong !", error: error };
        }
    }

    static async updateProductDetailById(productDetailId: String, newProductDetail: any) {
        try {
            const productDetail = await ProductDetail.findOne({ _id: productDetailId })
            if (productDetail) {
                const result = await ProductDetail.findByIdAndUpdate(productDetailId, newProductDetail);
                return {status: 204, message: "update Product Detail success !", data: result };
            }
            else
                return {status: 404, message: "Not found Product !" };
        } catch (error) {
            return {status: 500, message: "Something went wrong !", error: error };
        }
    }
}
