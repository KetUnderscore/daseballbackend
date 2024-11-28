const User = require('../models/SiteUser')

// User Related Routes here ----------------------------------------------------------------------------------------
exports.signup = async(req, res, next) => {

    const {username} = req.body;
    const userExists = await User.findOne({username})

    if (userExists) {
        return res.status(400).json({
            sucess: false,
            message: "User already exists."
        })
    }

    try {
        const user = await User.create(req.body)
        res.status(201).json({
            sucess: true,
            user
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            sucess: false,
            message: error.message
        })
    }
}

exports.signin = async(req, res, next) => {

    try {
        const {username, password} = req.body
        if (!username || !password) {
            return res.status(400).json({
                sucess: false,
                message: 'Username and password are required.'
            })
        }

        // Check if user is in database
        const user = await User.findOne({username})

        if (!user) {
            return res.status(400).json({
                sucess: false,
                message: "Invalid credentials."
            })
        }

        // Check password
        if (user.password != password) {
            return res.status(400).json({
                sucess: false,
                message: "Password is incorrect."
            })
        }

        const token = await user.jwtGenerateToken()

        res.status(200).json({
            sucess: true,
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            sucess: false,
            message: "Cannot login, check your email and password."
        })
    }

}