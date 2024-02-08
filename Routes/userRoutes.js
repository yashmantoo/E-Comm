import express from "express"
const userRouter = express.Router()
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import {signUp, logIn, logout, forgotPassword, resetPassword, getProfile, home, changePassword, getAllUsers} from "../controllers/authController.js"

userRouter.get("/", home)
userRouter.post("/signup", signUp)
userRouter.post("/logIn", logIn)
userRouter.get("/logout", logout)
userRouter.post("/forgotPassword", forgotPassword)
userRouter.post("/resetPassword/:resetToken", isLoggedIn, resetPassword)
userRouter.get("/getProfile", isLoggedIn, getProfile)
userRouter.post("/changePassword", isLoggedIn, changePassword)
userRouter.get("/allUsers", isLoggedIn, getAllUsers)

export default userRouter