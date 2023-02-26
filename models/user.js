import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Nmae is required."],
            maxLength: [25, "Name should not occupy more than 25 characters."]
        }
    }
)