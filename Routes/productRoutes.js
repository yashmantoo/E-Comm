import express from "express"
const productRouter = express.Router()
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { addProduct, deleteProduct, getAllProducts, getProductById, getProductsByCollection } from "../controllers/productController.js"

productRouter.post("/addProduct", isLoggedIn, addProduct)
productRouter.get("/getAllProducts", getAllProducts)
productRouter.get("/getProductById/:id", getProductById)
productRouter.get("/getProductByCollection/:collectionId", getProductsByCollection)
productRouter.delete("/deleteProduct/:productId", isLoggedIn, deleteProduct)

export default productRouter