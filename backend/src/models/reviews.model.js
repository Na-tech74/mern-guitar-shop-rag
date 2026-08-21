import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    title:{
        type:String,
        trim:true,
        default:""
    },
    comment:{
        type:String,
        required:true,
        trim:true
    }
}, {timestamps:true});

// mỗi người dùng chỉ đành giá một lần

reviewSchema.index({
    user:1 , product:1
}, {unique:true});

export default mongoose.model("Review", reviewSchema)