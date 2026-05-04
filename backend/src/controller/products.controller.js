import productModel from "../models/products.model.js";
import { appError } from "../utils/appError.js";

export const createProduct = async (req, res) => {

    const { name, description, price, category , stock } = req.body;    

     if(req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    };

    if (!name || !description || !price || !category || !stock) {
        throw appError("Missing fields!", 400); // 400: thiếu dữ liệu
    };

};