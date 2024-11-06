const express = require('express')
const router = express.Router()
const Player = require('../models/Player')
const PlayerStats = require('../models/PlayerStats')
const Team = require('../models/Team')
const Game = require('../models/Game')
const Season = require('../models/Season')
const { currentActiveSeason } = require('../config.json')

// Player Related Routesrouter.get('/players/:sortype/:name', async (req, res) => {
router.get('/players/:sortype', async (req, res) => {
    let currentseason = currentActiveSeason // Current season here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    let playerData = await Player.find({})
    let playerDataTemp = []

    if (req.params.sortype === 'total') {
        playerData.sort((a, b) => 
            (b.battery+b.assault+b.resistingArrest+b.praying+b.publicity+b.pope+b.hammer+b.stalin+b.sickle+b.clooning+b.throwing+b.batman) -
            (a.battery+a.assault+a.resistingArrest+a.praying+a.publicity+a.pope+a.hammer+a.stalin+a.sickle+a.clooning+a.throwing+a.batman))
    }
    if (req.params.sortype === 'pitching') {
        playerData.sort((a, b) => (b.praying+b.publicity+b.pope) - (a.praying+a.publicity+a.pope))
    }
    if (req.params.sortype === 'batting') {
        playerData.sort((a, b) => (b.battery+b.assault+b.resistingArrest) - (a.battery+a.assault+a.resistingArrest))
    }
    if (req.params.sortype === 'running') {
        playerData.sort((a, b) => (b.hammer+b.stalin+b.sickle) - (a.hammer+a.stalin+a.sickle))
    }
    if (req.params.sortype === 'fielding') {
        playerData.sort((a, b) => (b.clooning+b.throwing+b.batman) - (a.clooning+a.throwing+a.batman))
    }
    if (req.params.sortype === "battingaverage") {
            playerData = await PlayerStats.find({season: currentseason, atbats: {$gt: 0}})
            playerData.sort((a, b) => (Math.round((b.hitsgot/(b.atbats+1))*100)/100) - (Math.round((a.hitsgot/(a.atbats+1))*100)/100))
    }
    if (req.params.sortype === "onbasepercentage") {
            playerData = await PlayerStats.find({season: currentseason, atbats: {$gt: 0}})
            playerData.sort((a, b) => (Math.round(((b.hitsgot+b.walksgot)/(b.atbats+1))*100)/100) - (Math.round(((a.hitsgot+a.walksgot)/(a.atbats+1))*100)/100))
    }
    if (req.params.sortype === "slugging") {
        playerData = await PlayerStats.find({season: currentseason, atbats: {$gt: 0}})
        playerData.sort((a, b) => (Math.round((b.basesReached/(b.atbats+1))*100)/100) - (Math.round((a.basesReached/(a.atbats+1))*100)/100))
    }
    if (req.params.sortype === "ops") {
        playerData = await PlayerStats.find({season: currentseason, atbats: {$gt: 0}})
        playerData.sort((a, b) => ((Math.round(((Math.round(((b.hitsgot+b.walksgot)/b.atbats)*100)/100)+(Math.round((b.basesReached/b.atbats)*100)/100))*100)/100) - (Math.round(((Math.round(((a.hitsgot+a.walksgot)/a.atbats)*100)/100)+(Math.round((a.basesReached/a.atbats)*100)/100))*100)/100)))
    }

    if (req.params.sortype === "opspull") {
        playerData = await PlayerStats.find({season: currentseason, atbats: {$gt: 0}})
        playerData.sort((a, b) => ((Math.round(((Math.round(((b.hitsgot+b.walksgot)/b.atbats)*100)/100)+(Math.round((b.basesReached/b.atbats)*100)/100))*100)/100) - (Math.round(((Math.round(((a.hitsgot+a.walksgot)/a.atbats)*100)/100)+(Math.round((a.basesReached/a.atbats)*100)/100))*100)/100)))

        for (let x = 0; x < playerData.length(); x++)
{
    playerDataTemp.push(playerData[x].name)
}
        playerData = playerDataTemp

    }
    
    if (req.params.sortype === "era") {
        playerData = await PlayerStats.find({season: currentseason, innings: {$gt: 0}})
        playerData.sort((a, b) => (Math.round((9*a.earnedruns/(a.innings))*100)/100) - (Math.round((9*b.earnedruns/(b.innings))*100)/100))
    }
    if (req.params.sortype === "whip") {
        playerData = await PlayerStats.find({season: currentseason, innings: {$gt: 0}})
        playerData.sort((a, b) => (Math.round(((a.hitsallowed+a.walksissued)/(a.innings))*100)/100) - (Math.round(((b.hitsallowed+b.walksissued)/(b.innings))*100)/100))
    }
    if (req.params.sortype === "fans") {
        playerData = await Player.find({'fans.0': {$exists: true}})
        playerData.sort((a, b) => b.fans.length - a.fans.length)
    }

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

router.get('/players/:sortype/:name', async (req, res) => {
    let currentseason = currentActiveSeason // Current season here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    let searchOptions = {}
    if (req.params.name != null && req.query.name != '') {
        searchOptions.name = new RegExp(req.params.name, 'i')
    }
    let playerData = await Player.find(searchOptions)

    if (req.params.sortype === 'total') {
        playerData.sort((a, b) => 
            (b.battery+b.assault+b.resistingArrest+b.praying+b.publicity+b.pope+b.hammer+b.stalin+b.sickle+b.clooning+b.throwing+b.batman) -
            (a.battery+a.assault+a.resistingArrest+a.praying+a.publicity+a.pope+a.hammer+a.stalin+a.sickle+a.clooning+a.throwing+a.batman))
    }
    if (req.params.sortype === 'pitching') {
        playerData.sort((a, b) => (b.praying+b.publicity+b.pope) - (a.praying+a.publicity+a.pope))
    }
    if (req.params.sortype === 'batting') {
        playerData.sort((a, b) => (b.battery+b.assault+b.resistingArrest) - (a.battery+a.assault+a.resistingArrest))
    }
    if (req.params.sortype === 'running') {
        playerData.sort((a, b) => (b.hammer+b.stalin+b.sickle) - (a.hammer+a.stalin+a.sickle))
    }
    if (req.params.sortype === 'fielding') {
        playerData.sort((a, b) => (b.clooning+b.throwing+b.batman) - (a.clooning+a.throwing+a.batman))
    }
    if (req.params.sortype === "battingaverage") {
            playerData = await PlayerStats.find({name: searchOptions.name, season: currentseason, atbats: {$gt: 0}})
            playerData.sort((a, b) => (Math.round((b.hitsgot/(b.atbats+1))*100)/100) - (Math.round((a.hitsgot/(a.atbats+1))*100)/100))
    }
    if (req.params.sortype === "onbasepercentage") {
            playerData = await PlayerStats.find({name: searchOptions.name, season: currentseason, atbats: {$gt: 0}})
            playerData.sort((a, b) => (Math.round(((b.hitsgot+b.walksgot)/(b.atbats+1))*100)/100) - (Math.round(((a.hitsgot+a.walksgot)/(a.atbats+1))*100)/100))
    }
    if (req.params.sortype === "slugging") {
        playerData = await PlayerStats.find({name: searchOptions.name, season: currentseason, atbats: {$gt: 0}})
        playerData.sort((a, b) => (Math.round((b.basesReached/(b.atbats+1))*100)/100) - (Math.round((a.basesReached/(a.atbats+1))*100)/100))
    }
    if (req.params.sortype === "ops") {
        playerData = await PlayerStats.find({name: searchOptions.name, season: currentseason, atbats: {$gt: 0}})
        playerData.sort((a, b) => ((Math.round(((Math.round(((b.hitsgot+b.walksgot)/b.atbats)*100)/100)+(Math.round((b.basesReached/b.atbats)*100)/100))*100)/100) - (Math.round(((Math.round(((a.hitsgot+a.walksgot)/a.atbats)*100)/100)+(Math.round((a.basesReached/a.atbats)*100)/100))*100)/100)))
    }
    if (req.params.sortype === "era") {
        playerData = await PlayerStats.find({name: searchOptions.name, season: currentseason, innings: {$gt: 0}})
        playerData.sort((a, b) => (Math.round((9*a.earnedruns/(a.innings))*100)/100) - (Math.round((9*b.earnedruns/(b.innings))*100)/100))
    }
    if (req.params.sortype === "whip") {
        playerData = await PlayerStats.find({name: searchOptions.name, season: currentseason, innings: {$gt: 0}})
        playerData.sort((a, b) => (Math.round(((a.hitsallowed+a.walksissued)/(a.innings))*100)/100) - (Math.round(((b.hitsallowed+b.walksissued)/(b.innings))*100)/100))
    }
    if (req.params.sortype === "fans") {
        playerData = await Player.find({name: searchOptions.name, 'fans.0': {$exists: true}})
        playerData.sort((a, b) => b.fans.length - a.fans.length)
        playerData = playerData.slice(0, 10)
    }

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

router.get('/player/:name', async (req, res) => {
    const playerData = await Player.find(req.params)

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

router.get('/playerbyid/:_id', async (req, res) => {
    const playerData = await Player.find(req.params)

    if (playerData) {
        res.send(playerData)
    }
})

router.get('/playerData/', async (req, res) => {
    const playerData = await PlayerStats.find({})

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

router.get('/playerData/:name', async (req, res) => {
    const playerData = await PlayerStats.find(req.params)

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

router.get('/playerData/:name/:season', async (req, res) => {
    const playerData = await PlayerStats.find(req.params)

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

// Team Related Routes
router.get('/teams/', async (req, res) => {
    let teamData1 = await Team.find({division: "Old School"}).sort({gamesWon: -1}).exec()
    let teamData2 = await Team.find({division: "New School"}).sort({gamesWon: -1}).exec()
    let teamData3 = await Team.find({division: "Old Cool"}).sort({gamesWon: -1}).exec()
    let teamData4 = await Team.find({division: "New Cool"}).sort({gamesWon: -1}).exec()
    const teamData = [teamData1,teamData2,teamData3,teamData4]

    if (teamData) {
        res.send(teamData)
    }
})

router.get('/teams/postseason', async (req, res) => {
    let teamData = await Team.find({$limit : 4}).sort({gamesWon: -1, playoffGamesWon: -1}).exec()

    if (teamData) {
        res.send(teamData)
    }
})

router.get('/team/:teamName', async (req, res) => {
    const teamData = await Team.find(req.params)

    if (teamData) {
        res.send(teamData)
    }
})

// Season Related Routes
router.get('/season/:seasonNumber', async (req, res) => {
    const seasonData = await Season.find(req.params).exec()

    if (seasonData) {
        res.send(seasonData)
    }
})

// Game Related Routes
router.get('/games/', async (req, res) => {
    const gameData = await Game.find({}).exec()

    if (gameData) {
        res.send(gameData)
    }
})

router.get('/games/:season', async (req, res) => {
    let season = 1
    if (req.params.season) {
        season = req.params.season
    }
    const gameData = await Game.find({season: season}).exec()

    if (gameData) {
        res.send(gameData)
    }
})

router.get('/games/:season/:day', async (req, res) => {
    let season = 1
    let day = 1
    if (req.params.season) {
        season = req.params.season
    }
    if (req.params.day) {
        day = req.params.day
    }
    const gameData = await Game.find({season: season, gameDay: day}).exec()

    if (gameData) {
        res.send(gameData)
    }
})

module.exports = router