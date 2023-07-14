import Product from "../models/productSchema"
import Order from "../models/orderSchema"
import asyncHandler from "../services/asyncHandler"
import customError from "../utils/customError"
import razorpay from "../config/razorpay"
import config from "../config/index"

/**********************************************************
 * @GENEARATE_RAZORPAY_ID
 * @route https://localhost:4000/api/order/razorpay
 * @description Controller used for genrating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "Razorpay order id generated successfully"
 *********************************************************/

export const generateRazorpayOrderId = asyncHandler(async(req, res) => {
    const {product} = req.body

    // we hve to verify the price from backend

    let totalPrice = 0
    product.map(async(prod) => {
        const eachProduct = await Product.findById(prod._id)
        totalPrice += eachProduct.price* prod.quantity
    })

    const options = {
        amount: Math.round(totalPrice*100),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
    }

    const order = await razorpay.orders.create(options)

    if(!(order.status==="created"))
    {
        throw new customError("Failed to create order",401);
    }

    res.status(200).json({
        success: true,
        order,
    })
})

/**********************************************************
 * @GET_RAZORPAY_KEY
 * @route https://localhost:4000/api/order/getRazorpayKey
 * @description Controller used for sending razerorpay key
 * @returns razorpay key
 *********************************************************/

export const getRazorpayKey=asyncHandler(async(req,res)=>{

    res.status(200).json({
        success: true,
        key: config.RAZORPAY_KEY_ID,
    })
})