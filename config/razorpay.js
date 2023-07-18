import config from "./index.js"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_SECRET,
})

export default razorpay