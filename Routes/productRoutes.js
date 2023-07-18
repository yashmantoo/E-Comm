import express from "express"
const productRouter = express.Router()
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { addProduct, getAllProducts, getProductById } from "../controllers/productController.js"

productRouter.post("/addProduct", isLoggedIn, addProduct)
productRouter.get("/getAllProducts", getAllProducts)
productRouter.get("/getProductById/:id", getProductById)

export default productRouter