const express = require('express')
const cors = require('cors')
const router = express.Router()
const path = require('path')
const User = require('../models/SiteUser')
const Player = require('../models/Player')
const PlayerStats = require('../models/PlayerStats')
const GamePlayerStats = require('../models/GamePlayerStats')
const Team = require('../models/Team')
const Game = require('../models/Game')
const Season = require('../models/Season')
const Vote = require('../models/OldVote')
const { currentActiveSeason } = require('../config.json')

const app = express()

app.use(cors())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})

// Open Page    ----------------------------------------------------------------------------------------
router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'))
})

router.post('/signin/:un/:pwd', async (req, res) => {
    const userExists = await User.findOne({username: req.params.un})

    if (userExists && userExists.password != req.params.pwd) {
        return res.status(409).json({
            sucess: false,
            message: "Password incorrect."
        })
    }
    let userData = await User.findOne({username: req.params.un, password: req.params.pwd})
    console.log(userData)

    if (userData) {
        res.send(JSON.stringify(userData))
    }
})

// Player Related Routes    ----------------------------------------------------------------------------------------
router.get('/players', async (req, res) => {
    let playerData = await Player.find({})

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

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
        playerData = []
        playerDataTemp = await PlayerStats.find({season: currentseason, atbats: {$gt: 0}})
        for (let x = 0; x < playerDataTemp.length; x++){
            playerObp = (playerDataTemp[x].hitsgot+playerDataTemp[x].walksgot)/(playerDataTemp[x].atbats+playerDataTemp[x].walksgot)
            playerSlug = playerDataTemp[x].basesReached/playerDataTemp[x].atbats

            playerData.push({
                name:playerDataTemp[x].name,
                ops:playerObp+playerSlug
            })
        }
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

router.get('/gamePlayerData/:name', async (req, res) => {
    const gamePlayerData = await GamePlayerStats.find(req.params)

    if (gamePlayerData) {
        res.send(JSON.stringify(gamePlayerData))
    }
})

router.get('/gamePlayerData/:name/:season', async (req, res) => {
    const gamePlayerData = await GamePlayerStats.find(req.params)

    if (gamePlayerData) {
        res.send(JSON.stringify(gamePlayerData))
    }
})

router.get('/gamePlayerData/:name/:season/:gameDay', async (req, res) => {
    const gamePlayerData = await GamePlayerStats.find(req.params)

    if (gamePlayerData) {
        res.send(JSON.stringify(gamePlayerData))
    }
})

router.get('/playerDataOps/:season', async (req, res) => {
    playerData = []
    playerDataTemp = await PlayerStats.find({season: req.params.season, atbats: {$gt: 0}})
    for (let x = 0; x < playerDataTemp.length; x++){
        playerObp = (playerDataTemp[x].hitsgot+playerDataTemp[x].walksgot)/(playerDataTemp[x].atbats+playerDataTemp[x].walksgot)
        playerSlug = playerDataTemp[x].basesReached/playerDataTemp[x].atbats

        playerData.push({
            name:playerDataTemp[x].name,
            atBats:playerDataTemp[x].atbats,
            ops:playerObp+playerSlug
        })
    }

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

router.get('/playerDataEra/:season', async (req, res) => {
    playerData = []
    playerDataTemp = await PlayerStats.find({season: req.params.season, innings: {$gt: 0}})
    for (let x = 0; x < playerDataTemp.length; x++){
        playerEra = ((Math.round((9*playerDataTemp[x].earnedruns/(playerDataTemp[x].innings))*100)/100))

        playerData.push({
            name:playerDataTemp[x].name,
            innings:playerDataTemp[x].innings,
            era:playerEra
        })
    }

    if (playerData) {
        res.send(JSON.stringify(playerData))
    }
})

// Team Related Routes ----------------------------------------------------------------------------------------
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

// Season Related Routes ----------------------------------------------------------------------------------------
router.get('/season', async (req, res) => {
    const seasonData = await Season.find({ seasonNumber: currentActiveSeason }).exec()

    if (seasonData) {
        res.send(seasonData)
    }
})

router.get('/season/:seasonNumber', async (req, res) => {
    const seasonData = await Season.find(req.params).exec()

    if (seasonData) {
        res.send(seasonData)
    }
})

router.get('/seasonSchedule/:seasonNumber', async (req, res) => {
    const delay = millis => new Promise((resolve, reject) => {
        setTimeout(_ => resolve(), millis)
    });

    let seasonData = await Season.find(req.params).exec()

    let teamsData
    await getTeams(seasonData)
        .then(result => {
            teamsData = result;
        })

    let schedInfo = await getSchedule(teamsData, seasonData)

    seasonData[0].scheduleTeamInfo = schedInfo

    if (seasonData) {
        res.send(seasonData)
    }
})

// Game Related Routes ----------------------------------------------------------------------------------------
router.get('/games/', async (req, res) => {
    const gameData = await Game.find()

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

// Vote Related Routes ----------------------------------------------------------------------------------------
router.get('/votes/', async (req, res) => {
    let votes = await Vote.find()

    if (votes) {
        res.send(votes)
    }
})

router.get('/votes/:season', async (req, res) => {
    let votes = await Vote.find({season: req.params.season})

    if (votes) {
        res.send(votes)
    }
})

router.get('/votes/:season/:type', async (req, res) => {
    let votes = await Vote.find({season: req.params.season, voteType: req.params.type})

    if (votes) {
        res.send(votes)
    }
})

module.exports = router

async function getTeams(seasonData) {
    let teamersData = []
    if (seasonData[0].seasonDay >= 46) {
        for (x = 0; x < seasonData[0].playoffTeams.length; x++) {
            let team = await Team.find({teamName: seasonData[0].playoffTeams[x]})
            teamersData.push(team[0])
        }
    } else {
        for (x = 0; x < seasonData[0].teamLayout.length; x++) {
            let team = await Team.find({teamName: seasonData[0].teamLayout[x]})
            teamersData.push(team[0])
        }
    }
    return teamersData;
}

async function getSchedule(teamsData, seasonDatas) {
    let schedInfo = []
    for (j = seasonDatas[0].seasonDay; j < Math.min(seasonDatas[0].seasonDay+4, 45); j++) {
        let schedDay = await getDay(j, teamsData, seasonDatas)
        schedInfo.push(schedDay)
    }
        
    if (seasonDatas[0].seasonDay >= 46) {
        if (seasonDatas[0].postSeasonWeather[seasonDatas[0].seasonDay-46].length === 1) {
            for (j = seasonDatas[0].seasonDay-1; j < 55; j++) {
            let schedDay = await getDay(j-45, teamsData, seasonDatas)
            schedInfo.push(schedDay)
            }
        } else {
            for (j = seasonDatas[0].seasonDay-1; j < 50; j++) {
                let schedDay = await getDay(j-45, teamsData, seasonDatas)
                schedInfo.push(schedDay)
            }
        }
    }
    return schedInfo;
}

async function getDay(j, teamsData, seasonDatas) {
    let pointer = j
    let schedDay = []
    let teamCount = 12
    if (seasonDatas[0].seasonDay >= 46) {
        teamCount = 4
        if (seasonDatas[0].postSeasonWeather[seasonDatas[0].seasonDay-46].length === 1) {teamCount = 2}
        for (i = 0; i < teamCount; i++){
            let schedItem = JSON.parse(JSON.stringify(teamsData[seasonDatas[0].postSeasonSchedule[pointer][i]]))
            let pitcher = await Player.findById({_id: schedItem.pitchingRotation[pointer%schedItem.pitchingRotation.length]})
            schedItem.players = JSON.parse(JSON.stringify(pitcher))
            schedDay.push(schedItem)
        }
    } else {
        for (i = 0; i < teamCount; i++){
            let schedItem = JSON.parse(JSON.stringify(teamsData[seasonDatas[0].schedule[pointer][i]]))
            let pitcher = await Player.findById({_id: schedItem.pitchingRotation[pointer%schedItem.pitchingRotation.length]})
            schedItem.players = JSON.parse(JSON.stringify(pitcher))
            schedDay.push(schedItem)
        }
    }
    return schedDay
}