import app from "./server";
import config from "./config/config";
import connect from "./db/connect";


const PORT = config.app.PORT


connect().then(async function onServerStart() {
    console.log("Connected to database")

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })
})