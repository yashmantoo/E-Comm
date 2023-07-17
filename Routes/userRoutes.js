import express from "express"
const userRouter = express.Router()
import { isLoggedIn } from "../middlewares/auth.middleware"
import {signUp, logIn, logout, forgotPassword, resetPassword, getProfile} from "../controllers/authController"

userRouter.post("/signup", signUp)
userRouter.post("/logIn", logIn)
userRouter.get("/logout", logout)
userRouter.get("/forgotPassword", forgotPassword)
userRouter.get("/resetPassword", isLoggedIn, resetPassword)
userRouter.get("/getProfile", getProfile)

export default userRouter