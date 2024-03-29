import mongoose from "mongoose";
import validatorPackage from "validator"
import AuthRoles from "../utils/authRoles.js"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import crypto from "crypto"
import config from "../config/index.js"

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

// encrypt password

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){return next()}
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// more methods

userSchema.methods = {
    // compare password
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    },

    // generate jwt token
    getJwtToken: function(){
        return JWT.sign(
        {
            _id: this._id,
            role: this.role,
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRY
        }
        )
    }, 

    generateForgotPasswordToken: function(){
        const token = crypto.randomBytes(16).toString("hex")

        // save to DB and encrypt the token and token expiry is 20 min
        this.forgotPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")

        this.ForgotPasswordExpiry = Date.now() + 20*60*1000

        // send to user

        return token
    }
}






export default mongoose.model("User", userSchema)