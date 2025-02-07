const User = require('../models/SiteUser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

// @desc    Login
// @route   POST /auth
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })
    
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "favTeam": foundUser.favTeam,
                "favPlayer": foundUser.favplayer,
                "coins": foundUser.coins,
                "bets": foundUser.bets,
                "item": foundUser.item,
                "betMatrix": foundUser.betMatrix
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    )
    
    // Create secure cookie with refresh token
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
    
    // Send accessToken containing user info
    res.cookie('jwt', refreshToken, {
        httpOnly: false, // web only
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        partitioned: true
    })
    
    var jsonValue = JSON.stringify({
        "id": foundUser._id,
        "username": foundUser.username,
        "favTeam": foundUser.favTeam,
        "favPlayer": foundUser.favplayer,
        "coins": foundUser.coins,
        "bets": foundUser.bets,
        "item": foundUser.item,
        "betMatrix": foundUser.betMatrix
      })

    res.cookie('userInfo', jsonValue,
        {
            httpOnly: false, // web only
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            partitioned: true
        }
    )

    const userInfo = {
        "id": foundUser._id,
        "username": foundUser.username,
        "favTeam": foundUser.favTeam,
        "favPlayer": foundUser.favplayer,
        "coins": foundUser.coins,
        "bets": foundUser.bets,
        "item": foundUser.item,
        "betMatrix": foundUser.betMatrix
    }

    res.send(userInfo)
})

// @desc    Refresh
// @route   POST /auth/refresh
// @access  Public - because access token has expired
const refresh = (req, res) => {
    const { username } = req.body
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) {
                console.log(err)
                return res.status(403).json({ message: 'Forbidden' })
            }

            const foundUser = await User.findOne({ username: username })

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": foundUser._id,
                        "username": foundUser.username,
                        "favTeam": foundUser.favTeam,
                        "favPlayer": foundUser.favplayer,
                        "coins": foundUser.coins,
                        "bets": foundUser.bets,
                        "item": foundUser.item,
                        "betMatrix": foundUser.betMatrix
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            )

            const userInfo = {
                "id": foundUser._id,
                "username": foundUser.username,
                "favTeam": foundUser.favTeam,
                "favPlayer": foundUser.favplayer,
                "coins": foundUser.coins,
                "bets": foundUser.bets,
                "item": foundUser.item,
                "betMatrix": foundUser.betMatrix
            }
        
            res.send(userInfo)
        })
    )
}

// @desc    Logout
// @route   POST /auth/logout
// @access  Public - just to clear cookie if exists
const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', { httpOnly: false, sameSite: 'None', secure: true, partitioned: true })
res.json({ message: 'Cookie cleared' })
})

module.exports = {
    login,
    refresh,
    logout
}