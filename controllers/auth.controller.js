const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

const RegisterNewUser = async(req, res) => {
    try{
        const {username, email, password, roles} = req.body

        if(!username || !email || !password){
            return res.status(400).json('All fields are Required')
        }

        const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2 }).lean().exec()

        if (duplicate) {
            return res.status(409).json({ message: 'Duplicate username' })
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const userObj = (!Array.isArray(roles) || !roles.length)
        ? { username, email, password:hashedPassword }
        : { username, email, password:hashedPassword, roles}

        const newUser = await User.create(userObj)
        if (newUser) { //created 
            res.status(201).json({ message: `New user ${username} created` })
        }
    }catch (error){
        res.status(500).json(error)
    }
}
const Login = async(req, res) => {
    try{
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const foundUser = await User.findOne({username})

        if(!foundUser){
            return res.status(404).json('User not Found')
        }
        const matchPassword = await bcrypt.compare(password, foundUser.password)
        if(!matchPassword){
            return res.status(400).json('Wrong password')
        }
        const accessToken = jwt.sign(
            { 
                'userInfo': {
                    "username": foundUser.username,
                    "roles": foundUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m'}
        );
        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d'}
        );

        // Create secure cookie with refresh token 
        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server 
            //secure: true, //https
            sameSite: 'None', //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        })

        res.status(200).json({accessToken})
        //res.status(200).json(foundUser)
    }catch(error){
        res.status(500).json(error)
    }
}
const refresh = (req, res)=>{
    const cookies = req.cookies
    console.log({cookies})
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt
    console.log(refreshToken)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            console.log('tedt')

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                { 
                    'userInfo': {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}


module.exports = {
    RegisterNewUser,
    Login,
    refresh,
    logout
}