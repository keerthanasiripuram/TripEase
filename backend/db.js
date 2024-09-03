const mongoose = require('mongoose')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const connecttomongo = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("connected")
    }
    catch (err) {
        console.log("failed")
    }
}
connecttomongo()