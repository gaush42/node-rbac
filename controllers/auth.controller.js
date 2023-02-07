const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

const RegisterNewUser = async(req, res) => {
    try{
        const {username, email, password} = req.body

        if(!username || !email || !password){
            return res.status(400).json('All fields are Required')
        }
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        const userObj = { username, email, password:hashedPassword }
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
        const user = await User.findOne({username: req.body.username})
        if(!user){
            return res.status(404).json('User not Found')
        }
        const matchPassword = await bcrypt.compare(req.body.password, user.password)
        if(!matchPassword){
            return res.status(400).json('Wrong password')
        }else{
            res.status(200).json({
                message: 'Password Matched',
                userName: user.username,
                userPassword: user.password
            })
        }
    }catch(error){
        res.status(500).json(error)
    }
}

module.exports = {
    RegisterNewUser,
    Login
}