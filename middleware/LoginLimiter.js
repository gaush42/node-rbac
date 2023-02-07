const rateLimit = require('express-rate-limit')

const LoginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message:{
        message: 'Too many login Attempts please try after sometime'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = LoginLimiter