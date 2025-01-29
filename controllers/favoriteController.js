const User = require('../models/SiteUser')
const Player = require('../models/Player')
const Team = require('../models/Team')
const Season = require('../models/Season')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { currentActiveSeason } = require('../config.json')
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
        { expiresIn: '1m' },
        partitioned
    )
    
    // Create secure cookie with refresh token
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' },
        partitioned
    )
    
    // Send accessToken containing user info
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // web only
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        partitioned
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
            partitioned
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

    const foundUser = await User.findOne({ username : username }).exec()

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
        { expiresIn: '1m' },
        partitioned
    )
    
    // Create secure cookie with refresh token
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' },
        partitioned
    )
    
    // Send accessToken containing user info
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // web only
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        partitioned
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
            partitioned
        }
    )

    res.send()
})

// @desc    Team Bet
// @route   POST /fav/bet
// @access  Public
const bet = asyncHandler(async (req, res) => {
    const { username, betValue, teamBet, dayBet, dayNum } = req.body

    if (!username) { return res.status(400).json({ message: 'All fields are required' }) }

    const foundUser = await User.findOne({ username : username }).exec() // Check for user

    if (!foundUser) { return res.status(401).json({ message: 'Unauthorized' }) }

    const bettingTeam = await Team.findOne({ teamName : teamBet }); // Check for team
    
    if (!bettingTeam) { return res.status(401).json({ message: "Couldn't find team." }) }

    const bettingSeason = await Season.findOne({seasonNumber: currentActiveSeason}); // Check for season
    
    if (!bettingSeason) { return res.status(401).json({ message: "Couldn't find season." }) }

    if (dayBet <= bettingSeason.seasonDay) { return res.status(401).json({ message: 'That day has already passed!' }); } // Check if day valid

    if (dayBet > 55) { return res.status(401).json({ message: "That day can't occur!" }); } // Check if day valid

    if (betValue <= 0 || betValue > 500) { return res.status(401).json({ message: 'The max bet is 500!' }); } // Check if bet value is valid

    if (foundUser.coins >= (betValue)) {
        // Check if you've already bet here -----------------
        for (i = 0; i < foundUser.betMatrix.length; i++) {
            if (foundUser.betMatrix[i].team === bettingTeam.teamName && foundUser.betMatrix[i].gameDay === dayBet) {
                if (betValue < 10) {
                    return res.status(401).json({ message: `The minimum bet increase is 10!` });
                }
                if ((foundUser.betMatrix[i].coins + betValue) > 500) {
                    return res.status(401).json({ message: `You cannot increase your bet over 500!` });
                } else {
                    foundUser.betMatrix[i].coins = foundUser.betMatrix[i].coins+betValue
                    foundUser.coins -= betValue
                    foundUser.markModified('betMatrix');
                    await foundUser.save()
                }
            }
        }

        foundUser.coins -= betValue
        foundUser.betMatrix.push({team: bettingTeam.teamName, gameDay: dayBet, coins: betValue})
        
        await foundUser.save();
    } else {
        return res.status(401).json({ message: "You don't have enough money!" });
    }
    
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
        { expiresIn: '1m' },
        partitioned
    )
    
    // Create secure cookie with refresh token
    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' },
        partitioned
    )
    
    // Send accessToken containing user info
    res.cookie('jwt', refreshToken, {
        httpOnly: true, // web only
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        partitioned
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
            partitioned
        }
    )

    res.send()
})

module.exports = {
    change,
    teamup,
    bet,
}