const mongoose = require('mongoose')

const URI = 'mongodb://localhost:27017/db_1'

mongoose.set("strictQuery", true);
const connectDB = async()=>{
    try{
        await mongoose.connect(URI)
    }catch (error) {
        console.log(error)
    }
}

module.exports = connectDB