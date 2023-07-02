import User from "../models/user"
import asyncHandler from "../services/asyncHandler"
import customError from "../utils/customError"


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