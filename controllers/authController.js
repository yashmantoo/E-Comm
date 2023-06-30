import User from "../models/user"
import asyncHandler from "../services/asyncHandler"
import customError from "../utils/customError"


export const cookieOptions = {
    expires: new Date(Date.now() + 3*24*60*60*1000),
    http: true,
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