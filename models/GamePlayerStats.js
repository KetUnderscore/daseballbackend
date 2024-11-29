const { Schema, model } = require('mongoose');

const gamePlayerStatsSchema = new Schema({
    // Player Info
    playerid: {
        type: String,
        required: true,
    },
    season: {
        type: Number,
        required: true,
    },
    gameDay: {
        type: Number,
        required: true,
    },
    gameNumber: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    // Player Stats
        // Batting ------------------------
    atbats: {
        name: 'At Bats',
        type: Number,
        required: true,
        default: 0
    },
    hitsgot: {
        name: 'Hits',
        type: Number,
        required: true,
        default: 0
    },
    walksgot: {
        name: 'Walks',
        type: Number,
        required: true,
        default: 0
    },
    strikeoutsgotten: {
        name: 'Strikeouts Gotten',
        type: Number,
        required: true,
        default: 0
    },
    homers: {
        name: 'Home Runs',
        type: Number,
        required: true,
        default: 0
    },
    triples: {
        name: 'Triple Hits',
        type: Number,
        required: true,
        default: 0
    },
    doubles: {
        name: 'Double Hits',
        type: Number,
        required: true,
        default: 0
    },
    runsin: {
        name: 'Runs Batted In',
        type: Number,
        required: true,
        default: 0
    },
        // Pitching ------------------------
    appearance: {
        name: 'Appearances',
        type: Number,
        required: true,
        default: 0
    },
    innings: {
        name: 'Innings Pitched',
        type: Number,
        required: true,
        default: 0
    },
    hitsallowed: {
        name: 'Hits Allowed',
        type: Number,
        required: true,
        default: 0
    },
    walksissued: {
        name: 'Walks Issued',
        type: Number,
        required: true,
        default: 0
    },
    strikeoutsgiven: {
        name: 'Strikeouts Given',
        type: Number,
        required: true,
        default: 0
    },
    earnedruns: {
        name: 'Earned Runs',
        type: Number,
        required: true,
        default: 0
    },
        // Running ------------------------
    runs: {
        name: 'Runs',
        type: Number,
        required: true,
        default: 0
    },
    basesReached: {
        name: 'Bases',
        type: Number,
        required: true,
        default: 0
    },
    basesStolen: {
        name: 'Bases',
        type: Number,
        required: true,
        default: 0
    },
    basesCaughtStealing: {
        name: 'Bases',
        type: Number,
        required: true,
        default: 0
    },
    // Fielding ------------------------
    stealsPrevented: {
        name: 'Runs',
        type: Number,
        required: true,
        default: 0
    },
    stealsAllowed: {
        name: 'Bases',
        type: Number,
        required: true,
        default: 0
    },
});

module.exports = model('GamePlayerStats', gamePlayerStatsSchema, "gamePlayersStats");