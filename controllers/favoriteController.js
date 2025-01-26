const User = require('../models/SiteUser')
const Player = require('../models/Player')
const Team = require('../models/Team')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

// @desc    Change
// @route   POST /fav/player
// @access  Public
const change = asyncHandler(async (req, res) => {
    const { username, player } = req.body

    if (!username) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    if (foundUser.favplayer != "None") {
        let oldFav = await Player.findOne({name: foundUser.favplayer}).exec()
        //REMOVE OLD FAV HERE
        fanToRemove = oldFav.sitefans.findIndex((element) => element.user == foundUser.username) // Find user
        oldFav.sitefans.splice(fanToRemove, 1) // Remove user
        await oldFav.save()
    }

    let newFav = await Player.findOne({name: player})
    
    if (!newFav) {
        return res.status(401).json({ message: "Couldn't find player" })
    }

    if (newFav.fans) {
        if (newFav.sitefans.length > 0) {
            newFav.sitefans.push({user: foundUser.username})
        } else {
            newFav.sitefans = [{user: foundUser.username}]
        }
    } else {
        newFav.sitefans = [{user: foundUser.username}]
    }
    newFav.save()

    foundUser.favplayer = player
    await foundUser.save()
    
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
        httpOnly: true, // web only
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
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
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    res.send()
})

// @desc    Team Update
// @route   POST /fav/team
// @access  Public
const teamup = asyncHandler(async (req, res) => {
    const { username, team } = req.body

    if (!username) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    foundUser.favTeam = team
    await foundUser.save()
    
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
        httpOnly: true, // web only
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
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
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    )

    res.send()
})

module.exports = {
    change,
    teamup,
}