import { ProductDetail } from "../models/ProductDetail";
import { ProductService } from "./Product.service";
export class ProductDetailService {
    //Note Chỗ này phải tìm bên product, trả về list object id product detail sau đó mới tìm trong product detail
    static async getProductDetailByProductId(productId: String, callback: any) {
        try {
            const product = await ProductService.getProductById(productId)
            console.log(product);
            const productDetails = await ProductDetail.find({ product: productId })
            if (productDetails.length > 0) {
                callback({ message: "found Product Size success !", data: productDetails })
            }
            else
                callback({ message: "Not found Product Detail with product id: !" + productId })
        } catch (error) {
            callback({ message: "Something went wrong !", error: error });
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

    static async createProductDetail(productDetail: any, callback: any) {
        try {
            const newProductDetail = new ProductDetail(productDetail);
            await newProductDetail.save();
            callback({ message: "create Product Detail success !", data: newProductDetail })

        } catch (error) {
            callback({ message: "Something went wrong !", error: error });
        }
    }

    static async updateProductDetailById(productDetailId: String, newProductDetail: any, callback: any) {
        try {
            const productDetail = await ProductDetail.findOne({ _id: productDetailId })
            if (productDetail) {
                const result = await ProductDetail.findByIdAndUpdate(productDetailId, newProductDetail);
                callback({ message: "update Product Detail success !", data: result })
            }
            else
                callback({ message: "Not found Product !" })
        } catch (error) {
            callback({ message: "Something went wrong !", error: error });
        }
    }
}
