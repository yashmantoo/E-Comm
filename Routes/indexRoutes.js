import express from "express"
const mainRouter = express.Router()
import userRouter from "./userRoutes"
import productRouter from "./productRoutes"
import collectionRouter from "./collectionRoutes"
import orderRouter from "./orderRoutes"

mainRouter.use("/auth", userRouter)
mainRouter.use("/product", productRouter)
mainRouter.use("/collection", collectionRouter)
mainRouter.use("/order", orderRouter)

export default mainRouter