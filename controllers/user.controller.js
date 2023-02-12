const User = require('../models/user.model')

const getAllUser = async(req, res) => {
    const userdata = await User.find().select('-password')
    if(!userdata?.length) return res.status(400).json({message: 'No data available'})
    res.status(200).json({userdata})
}

const updateUserRole = async(req, res) => {
    try{
        const id = req.params.id
        const updatedUser = await User.findByIdAndUpdate(id, {$set: req.body,})
        await res.status(200).json({message: 'Updated'})
    }catch(error){
        res.status(500).json(error)
    }
    
}

const deleteUser = async(req, res) => {
    try{
        const id = req.params.id
        if(id !== User.findById(id)) return res.status(404).json('No data')
        await User.findByIdAndDelete(id)
        res.status(200).json('Deleted')
    }catch(error){
        res.status(500).json(error)
    }
}

module.exports = {
    getAllUser,
    updateUserRole,
    deleteUser
}