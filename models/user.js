import mongoose, { model } from "mongoose";
import validatorPackage from "validator"
import AuthRoles from "../utils/authRoles"

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Nmae is required."],
            maxLength: [25, "Name should not occupy more than 25 characters."]
        },
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            validate: {
                validator: validatorPackage.isEmail,
                message: "Provide a valid Email."
            }
        },
        password: {
            type: String,
            required: [true, "Password is required."],
            minLength: [8, "Password must be atleast 8 characters."],
            select: false
        },
        role:{
            type: String,
            enum: Object.values(AuthRoles),
            default: AuthRoles.USER
        },
        forgotPasswordToken: String,
        ForgotPasswordExpiry: Date,

    },

    {
        timestamps: true
    },
)

export default mongoose.model("User", userSchema)