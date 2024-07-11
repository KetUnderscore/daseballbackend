const { Schema, model } = require('mongoose');

const gameDataSchema = new Schema({
    season: {
        type: Number,
        default: 0,
    },
    gameDay: {
        type: Number,
        default: 0,
    },
    gameNumber: {
        type: Number,
        default: 0,
    },
    homeTeam: {
        type: Object,
        required: true,
    },
    awayTeam: {
        type: Object,
        required: true,
    },
    homeScore: {
        type: Number,
        default: 0,
    },
    awayScore: {
        type: Number,
        default: 0,
    },
    eventsHappened: {
        type: String,
        default: '',
    },
    homePitcher: {
        type: Object,
        default: {},
    },
    homeBatterUp: {
        type: Object,
        default: {},
    },
    homeBatterIndex: {
        type: Number,
        default: 0,
    },
    homeStrikes: { // How many strikes to strikeout a home player
        type: Number,
        default: 3,
    },
    awayPitcher: {
        type: Object,
        default: {},
    },
    awayBatterUp: {
        type: Object,
        default: {},
    },
    awayBatterIndex: {
        type: Number,
        default: 0,
    },
    awayStrikes: { // How many strikes to strikeout an away player
        type: Number,
        default: 3,
    },
    inningNumber: {
        type: Number,
        default: 1,
    },
    inningScore: { // Score of current inning
        type: Number,
        required: true,
        default: 0,
    },
    topOfInning: {
        type: Boolean,
        default: true,
    },
    inningBreakdown: { // Array of inning scores
        type: Array,
        required: true,
        default: [],
    },
    baseOne: {
        type: Boolean,
        default: false,
    },
    baseTwo: {
        type: Boolean,
        default: false,
    },
    baseThree: {
        type: Boolean,
        default: false,
    },
    baseHome: {
        type: Array,
        default: [],
    },
    currentBatter: {
        type: Object,
        default: {},
    },
    currentPitcher: {
        type: Object,
        default: {},
    },
    currentStrikes: {
        type: Number,
        default: 0,
    },
    strikesNeeded: {
        type: Number,
        default: 3,
    },
    currentBalls: {
        type: Number,
        default: 0,
    },
    ballsNeeded: {
        type: Number,
        default: 4,
    },
    currentOuts: {
        type: Number,
        default: 0,
    },
    weather: {
        type: Number,
        default: 0,
    },
    gameText: {
        type: String,
        default: "Time for a game!",
    },
    gameStarted: {
        type: Boolean,
        default: false,
    },
    gameOver: {
        type: Boolean,
        default: false,
    },
    gameState: {
        type: String,
        default: "",
    },
});

module.exports = model('GameData', gameDataSchema, "games");