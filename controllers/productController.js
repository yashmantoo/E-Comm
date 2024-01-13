import Product from "../models/productSchema.js"
import formidable from "formidable"
import fs from "fs"
import {s3FileUpload, s3deleteFile} from "../services/imageUploader.js"
import Mongoose from "mongoose"
import asyncHandler from "../services/asyncHandler.js"
import customError from "../utils/customError.js"
import config from "../config/index.js"
import authRoles from "../utils/authRoles.js"

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:4000/api/product/new
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

export const addProduct = asyncHandler(async(req, res) => {

    if(req.user.role==authRoles.USER)
    {
        throw new customError("You are not authorized to access this route",400)
    }

    const form = formidable({
        multiples: true,
        keepExtensions: true,
    })

    form.parse(req, async function(err, fields, files){
        try {

            if(err){
                throw new customError(err.message || "Something went wrong", 500)
            }
            let productId = new Mongoose.Types.ObjectId().toHexString()
            // this makes every filename unique so that even if two files have the same name they will still be unique

            if (!fields.name || 
                !fields.price ||
                !fields.description ||
                !fields.collectionId
                ) {
                    throw new customError("Please fill all details", 500)
            }

            // img handling
            // promise.all ensures all the promises since we have multiple in forms so we are gonna have more than one promise

            let imgArrayResponse = Promise.all(Object.keys(files).map(async(filekey, index) => {
                const element = files[filekey]
                // element will have all the info about the file we want to upload eg filepath etc

                const data = fs.readFileSync(element.filepath)

                const upload = await s3FileUpload({
                    bucketName: config.S3_BUCKET_NAME,
                    key: `products/${productId}/photo_${index + 1}.png`,
                    body: data,
                    contentType: element.mimetype,
                    // mimetype gives the jpg or png or pdf
                })
                return{
                    secure_url: upload.Location
                    // Location gives the location of the entire bucket
                }
            }))

            let imgArray = await imgArrayResponse

            const product = await Product.create({
                _id: productId,
                photos: imgArray,
                ...fields,
            })
            if (!product) {
                throw new customError("Product was not created", 400)
                //remove image
            }
            res.status(200).json({
                success: true,
                product,
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Something went wrong",
            })
        }
    })
})

/**********************************************************
 * @GET_ALL_PRODUCTS
 * @route https://localhost:4000/api/product/all
 * @description Controller used for getting all products details
 * @description User and admin can get all the prducts
 * @returns Products Object
 *********************************************************/

export const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})

    if (!products) {
        throw new customError("No product was found", 404)
    }

    res.status(200).json({
        success: true,
        products,
    })
})

/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route https://localhost:4000/api/product/id
 * @description Controller used for getting single product details
 * @description User and admin can get single product details
 * @returns Product Object
 *********************************************************/

export const getProductById = asyncHandler(async(req, res) => {
    const {id: productId} = req.params
    const product = Product.findById(productId)

    if (!product) {
        throw new customError("No product was found", 404)
    }

    res.status(200).json({
        success: true,
        product,
    })
})


/**********************************************************
 * @GET_PRODUCT_BY_COLLECTION
 * @route https://localhost:4000/api/product/getProductsByCategory/${id}
 * @description Controller used for getting product details by collection
 * @returns Product Object
 *********************************************************/

export const getProductsByCollection = asyncHandler(async(req, res) => {
    const {collectionId} = req.params

    if(!(collectionId))
    {
        throw new customError("Collection Id is needed", 400)
    }

    const products = await Product.find({collectionId: collectionId})

    if(!(products))
    {
        throw new customError("Collection not found",400)
    }

    res.status(201).json({
        success: true,
        products
    })
})

export const deleteProduct = asyncHandler(async(req, res) => {
    const {productId} = req.params

    if(req.user.role==authRoles.USER)
    {
        throw new customError("You are not authorized to access this route",400)
    }

    const deletedProduct = await Product.findByIdAndDelete(productId)

    if(!deletedProduct)
    {
        throw new customError("Product not found, 400")
    }

    deletedProduct.remove()

    res.status(200).json({
        success:true,
        message: "Product deleted successfully"
    })
})