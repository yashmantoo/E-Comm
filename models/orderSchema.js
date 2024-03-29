import mongoose from "mongoose";
import orderStatus from "../utils/orderStatus.js"

const orderSchema = mongoose.Schema(
    {
        products: {
            type: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                    },
                    count: Number,
                    price: Number,
                    productName: String,
                    productImage: String

                }
            ],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        phoneNumber: {
            type: Number,
            required:true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(orderStatus),
            default: orderStatus.ORDERED
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model("Order", orderSchema)