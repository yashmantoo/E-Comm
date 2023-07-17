import Collection from "../models/collectionSchema";
import asyncHandler from "../services/asyncHandler";
import customError from "../utils/customError";

export const createCollection = asyncHandler(async(req, res) => {
    const {name} = req.body

    if(req.user.role==AuthRoles.USER)
    {
        throw new customError("Only admin can add collections",400)
    }

    if(!name){
        throw new customError("Collection name is needed", 400)
    }

    const collection = await Collection.create({name})
    res.status(200).json({
        success:true,
        message: "Collection created successfully",
        collection
    })
})

export const updateCollection = asyncHandler(async(req, res) => {
    // update the name of the collection

    const {id: collectionId} = req.params
    const{name} = req.body

    if(req.user.role==AuthRoles.USER)
    {
        throw new customError("You are not authorized to access this route",400)
    }

    if(!name){
        throw new customError("Collection name is needed", 400)
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
        collectionId,
        // name is what we are gonna update
        {name},  
        {
            // new gives us the new version of collection
            new: true,
            runValidators: true,
        }

    )

    // if the collection id is not in the database
    if (!updatedCollection) {
        throw new customError("Collection not found", 400)
    }

    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        updatedCollection,
    })
})

export const deleteCollection = asyncHandler(async(req, res) => {
    const {id: collectionId} = req.params

    if(req.user.role==AuthRoles.USER)
    {
        throw new customError("You are not authorized to access this route",400)
    }

    const deletedCollection = await Collection.findByIdAndDelete(collectionId)

    if (!deletedCollection) {
        throw new customError("Collection not found", 400)
    }

    // frees up the memory
    deletedCollection.remove()
    res.status(200).jsno({
        success:true,
        message: "Collection deleted successfully"
    })
})

export const getAllCollections = asyncHandler(async(req, res) => {
    const collections = await Collection.find()

    if (!collections) {
        throw new customError("No Collection found", 400)
    }

    res.status(200).json({
        success: true,
        collections,
    })
})