import express from "express"
const mainRouter = express.Router()
import userRouter from "./userRoutes.js"
import productRouter from "./productRoutes.js"
import collectionRouter from "./collectionRoutes.js"
import orderRouter from "./orderRoutes.js"

mainRouter.use("/auth", userRouter)
mainRouter.use("/product", productRouter)
mainRouter.use("/collection", collectionRouter)
mainRouter.use("/order", orderRouter)

export default mainRouter