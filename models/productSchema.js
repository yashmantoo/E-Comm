import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "product name is needed."],
            trim: true,
            maxlength: [50, "product name should not exceed 50 chrarcters."],
        },
        price: {
            type: Number,
            required: [true, "price has to be mentioned."],
            maxlength: [10, "price cannot be more than 10 digits."],
        },
        description: {
            type: String,
        },
        photos: [
            {
                secure_url: {
                    type: String,
                    required: true,
                }
            }
        ],
        stock: {
            type: Number,
            default: 0,
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
        }

    },
    {
        timestamps: true
    }
)

export default mongoose.model("Product", productSchema)