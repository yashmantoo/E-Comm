import mongoose from "mongoose";

const collectionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is needed."],
            trim: true,
            maxLength: [50, "Collection name should not exceed 50 characters."],
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Collection", collectionSchema)