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
});

module.exports = model('TeamData', teamDataSchema, "teams");