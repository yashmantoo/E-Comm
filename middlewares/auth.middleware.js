import User from "../models/user.js"
import JWT from "jsonwebtoken"
import asyncHandler from "../services/asyncHandler.js"
import customError from "../utils/customError.js"
import config from "../config/index.js"

export const isLoggedIn = asyncHandler(async(req, _res, next) => {
    let token
    if(req.cookies.token ||
      req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        throw new customError('Not authorized to access this route', 401)
    }

    try {

        const decodedPayload = JWT.verify(token, config.JWT_SECRET)
        // find user by _id and their name, email and role because we dont want anything else.

        req.user = await User.findById(decodedPayload._id, "name email role")
        next()

    } catch (error) {

            throw new customError('Not authorized to access this route', 401)
    }
})