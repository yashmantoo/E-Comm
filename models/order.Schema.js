import mongoose from "mongoose";
import orderStatus from "../utils/orderStatus"

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