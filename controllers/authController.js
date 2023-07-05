import User from "../models/user"
import asyncHandler from "../services/asyncHandler"
import customError from "../utils/customError"
import mailHelper from "../utils/mailHelper"



export const cookieOptions = {
    expires: new Date(Date.now() + 3*24*60*60*1000),
    httpOnly: true,
    // expires in 3days
}

/******************************************************
 * @SIGNUP
 * @route http://localhost:4000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/

export const signUp = asyncHandler(async (req, res) => {

    const {name, email, password} = req.body

    if (!name || !email || !password) {
        throw new customError("Please fill all the fields", 400)
    }

    // check if user already exists

    const existingUser = await User.findOne({email})

    if(existingUser) {
        throw new customError("User already exists ", 400)
    }

    const user = User.create({
        name,
        email,
        password,
    })
    const token = user.getJwtToken()
    console.log(user)
    user.password = undefined

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        success: true,
        token,
        user,
    })

})

/******************************************************
 * @LOGIN
 * @route http://localhost:4000/api/auth/login
 * @description User logIn controller for logging in new user
 * @parameters email, password
 * @returns User Object
 ******************************************************/

export const logIn = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        throw new customError("Please fill all the fields", 400)
    }

    const user = User.findOne({email}).select("+password")
    if (!user) {
        throw new CustomError('Invalid credentials', 400)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(isPasswordMatched){
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new customError("Invalid Credentials - password", 400)
})

/******************************************************
 * @LOGOUT
 * @route http://localhost:4000/api/auth/logout
 * @description User logout by clearing user cookies
 * @parameters  
 * @returns success message
 ******************************************************/

export const logout = asyncHandler(async (_req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
    // can also use clear cookie res.clearCookie()
})

/******************************************************
 * @FORGOT_PASSWORD
 * @route http://localhost:4000/api/auth/password/forgot
 * @description User will submit email and we will generate a token
 * @parameters  email
 * @returns success message - email sent
 ******************************************************/

const forgotPassword = asyncHandler(async(req, res) => {
    const {email} = req.body
    if (!email) {
        throw new customError("Please fill all the fields", 400)
    }

    const user = await User.findOne(email)

    if(!user){
        throw new customError('User not found', 404)
    }

    const resetToken = user.generateForgotPasswordToken()
    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`
    //  req.protocol gives us http or https depending on the type of server eg http for local host and https for websites
    // req.get("host")}/ gives us the domain name of the website for example amazon.com
    // ${resetToken} we get from req.params

    const text = `Your password reset url is
    \n\n ${resetUrl}\n\n
    `
    try {
        await mailHelper({
            email: user.email,
            subject: "Password reset email for website",
            text:text,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
    } catch (err) {
        //roll back - clear fields and save because if there is an error and the mail is not sent these two fields are gonna get populated for nothing
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        await user.save({validateBeforeSave: false})

        throw new customError(err.message || 'Email sent failure', 500)
    }

})

/******************************************************
 * @RESET_PASSWORD
 * @route http://localhost:4000/api/auth/password/reset/:resetToken
 * @description User will be able to reset password based on url token
 * @parameters  token from url, password and confirm password
 * @returns User object
 ******************************************************/

