const { Schema, model } = require('mongoose');

const teamDataSchema = new Schema({
    teamName: {
        type: String,
        required: true,
    },
    nickName: {
        type: String,
        required: true,
    },
    teamColor: {
        type: String,
        required: true,
    },
    teamEmoji: {
        type: String,
        required: true,
    },
    players: {
        type: Array,
        default: [],
    },
    teamMods: {
        type: Array,
        default: [],
    },
    pitchingRotation: {
        type: Array,
        default: [],
    },
    battingRotation: {
        type: Array,
        default: [],
    },
    shadowRotation: {
        type: Array,
        default: [],
    },
    gamesPlayed: {
        type: Number,
        default: 0,
    },
    gamesWon: {
        type: Number,
        default: 0,
    },
    gamesLost: {
        type: Number,
        default: 0,
    },
    playoffGamesWon: {
        type: Number,
        default: 0,
    },
    playoffGamesLost: {
        type: Number,
        default: 0,
    },
    teamRole: {
        type: String,
        default: "",
    },
    betsWaiting: { // Bet holder to pay out at the end of a game
        type: Array,
        default: [],
    },
    betsNew: { // New bets
        type: Array,
        default: [],
    },
    championshipWins: { // Count of Championship Wins
        type: Number,
        default: 0,
    },
    championshipLosses: { // Count of Championship Wins
        type: Number,
        default: 0,
    },
    seasonRunsScored: { // Count of runs scored this season
        type: Number,
        default: 0,
    },
    seasonRunsAllowed: { // Count of runs allowed this season
        type: Number,
        default: 0,
    },
    maxVibe: { // Increases by 5 every season win
        type: Number,
        default: 25,
    },
    minVibe: { // Decreases by 5 every season win
        type: Number,
        default: -25,
    },
    curVibe: { // Starts at 0 each season
        type: Number,
        default: 0,
    },
    spirit: { // Starts at 0, shows spirit level
        type: Number,
        default: 0,
    },
    spiritFund: { // Starts at 0, maxes at Max
        type: Number,
        default: 0,
    },
    spiritMax: { // Spirit Fund max
        type: Number,
        default: 10000,
    },
    stadium: {
        name: 'Stadium',
        type: Object,
        required: true,
        default: {
            name:"???",
            description:"???",
            emoji:"?",
            stats:[
                0, // Air Quality | Higher for batting buff, lower for pitching buff
                0, // Ground Roughness | Higher for running buff, lower for fielding buff
                0, // Sky Density | Higher to call weather, lower to not
                0, // Length | Higher for batting debuff, lower for batting buff
                0, // Plength | Higher for pitching debuff, lower for pitching buff
                0, // Width | Higher for running debuff, lower for running buff
                0, // Height | Higher for fielding debuff, lower for fielding buff
                0, // Confectionary | Higher for more parties, lower for more loot crates
            ],
            modifiers:[],
        }
    },
});

module.exports = model('TeamData', teamDataSchema, "teams");