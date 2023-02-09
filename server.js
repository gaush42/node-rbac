const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')


const connectDB = require('./config/db.config')

const app = express()
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

const PORT = 8000

connectDB()

app.get('/', (req, res) => {
    res.json({
        message: 'Role Based Access Control'
    })
})

app.use('/', require('./routes/auth.routes'))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})

mongoose.connection.on('error', error => {
    console.log(error)
}) 
