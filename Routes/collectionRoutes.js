import express from "express"
const collectionRouter = express.Router()
import { isLoggedIn } from "../middlewares/auth.middleware.js"
import { createCollection, deleteCollection, getAllCollections, updateCollection } from "../controllers/collectionController.js"

collectionRouter.post("/createCollection", isLoggedIn, createCollection)
collectionRouter.put("/updateCollection/:collectionId", isLoggedIn, updateCollection)
collectionRouter.delete("/deleteCollection/:collectionId", isLoggedIn, deleteCollection)
collectionRouter.get("/getAllCollections", getAllCollections)

export default collectionRouter