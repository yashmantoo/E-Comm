import express from "express"
const collectionRouter = express.Router()
import { isLoggedIn } from "../middlewares/auth.middleware"
import { createCollection, deleteCollection, getAllCollections, updateCollection } from "../controllers/collectionController"

collectionRouter.post("/createCollection", isLoggedIn, createCollection)
collectionRouter.put("/updateCollection", isLoggedIn, updateCollection)
collectionRouter.delete("/deleteCollection", isLoggedIn, deleteCollection)
collectionRouter.get("/getAllCollections", getAllCollections)

export default collectionRouter