import Product from "../models/productSchema"
import formidable from "formidable"
import fs from "fs"
import {s3FileUpload, s3deleteFile} from "../services/imageUploader"
import Mongoose from "mongoose"
import asyncHandler from "../services/asyncHandler"
import customError from "../utils/customError"
import config from "../config/index"

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:4000/api/product/new
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

export const addProduct = asyncHandler(async(req, res) => {
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
 * @GET_ALL_PRODUCT
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