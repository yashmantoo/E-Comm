import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("DB Connected")

        app.on("err", (err) => {
            console.log("ERROR", err)
            throw err
        })

        const onListening = () => {
            console.log(`Listening on http://localhost:${config.PORT}`)
        }

        app.listen(config.PORT, onListening)

    } catch (error) {
        console.log("ERROR", error)
        throw error
    }
})()