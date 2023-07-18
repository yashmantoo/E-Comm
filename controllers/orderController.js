import Product from "../models/productSchema.js"
import Order from "../models/orderSchema.js"
import asyncHandler from "../services/asyncHandler.js"
import customError from "../utils/customError.js"
import razorpay from "../config/razorpay.js"
import config from "../config/index.js"
import crypto from "crypto"

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
 * @description Controller used for sending razorpay key
 * @returns razorpay key
 *********************************************************/

export const getRazorpayKey = asyncHandler(async(_req,res)=>{

    res.status(200).json({
        success: true,
        key: config.RAZORPAY_KEY_ID,
    })
})

/******************************************************
 * @PAYMENT_VERIFICATION
 * @route http://localhost:4000/api/v/order/paymentVerification
 * @description verify razorpay signature and create order in database
 * @parameters orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, product, address, phoneNumber, totalPrice
 * @returns success message "Payment completed successfully"
 ******************************************************/

export const paymentVerification = asyncHandler(async(req, res) => {

    // razorpay handles the whole payment and checkout, we just have to verify the payment signature that razorpay sends after checkout to us.
    
    try {
        const {orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, product, address, phoneNumber, amount}=req.body;

        const generatedSignature = crypto
        .createHmac("sha256", config.RAZORPAY_SECRET)
        .update(orderCreationId + "|" + razorpayPaymentId)
        .digest("hex")

        if(generatedSignature === razorpaySignature){
            const productArray = await Promise.all(product.map(async (prod) => {

                const specificProduct = await Product.findById(prod._id)
                specificProduct.stock = specificProduct.stock - prod.quantity
                await specificProduct.save()
                return{
                    productId: specificProduct._id,
                    productImage: specificProduct.photos[0].secure_url,
                    productName: specificProduct.name,
                    count: prod.quantity,
                    price: specificProduct.price,
                }
            }))

            const order = await Order.create({
                products: productArray,
                user: req.user._id,
                address: address,
                phoneNumber: phoneNumber,
                totalAmount: amount,
                transactionId: orderCreationId,

            })
            res.status(200).json({
                success: true,
                message: "Payment completed Successfully",
            })
        }
        else{
            res.status(400).json({
                success: false,
                message: "Payment Failed"
            })
        }

    } catch (error) {
        
        throw new customError(error, 400)
    }

})

/******************************************************
 * @GET_ORDER_HISTORY
 * @route http://localhost:4000/api/order/orderHistory
 * @description show order history by taking user._id
 * @parameters 
 * @returns order history of the user
 ******************************************************/

export const getOrderHistory = asyncHandler(async(req, res) =>{

    const userId = req.user._id
    const orders = await Order.find({user: userId})

    if(!orders)
    {
        throw new customError("Order history not found",404);
    }

    res.status(200).json({
        success: true,
        orders,
    })
})