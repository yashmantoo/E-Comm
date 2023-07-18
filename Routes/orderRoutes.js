import express from "express"
const orderRouter = express.Router()
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { generateRazorpayOrderId, getOrderHistory, getRazorpayKey, paymentVerification } from "../controllers/orderController.js"

orderRouter.post("/payment", isLoggedIn, generateRazorpayOrderId)
orderRouter.get("/getRazorpayKey", isLoggedIn, getRazorpayKey)
orderRouter.post("/paymentVerification", isLoggedIn, paymentVerification)
orderRouter.get("/orderHistory", isLoggedIn, getOrderHistory)

export default orderRouter