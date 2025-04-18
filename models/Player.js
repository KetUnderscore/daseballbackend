const { Schema, model } = require('mongoose');

const playerDataSchema = new Schema({
    // Player Info
    name: {
        type: String,
        required: true,
    },
    modifiers: {
        type: Array,
        required: true,
        default: []
    },
    playerNumber: {
        type: Number,
        required: true,
        default: 0
    },
    teamid: {
        type: String,
        required: true,
        default: "0",
    },
    teamEmoji: {
        type: String,
        required: true,
        default: " ",
    },
    // Player Stats
        // Batting
    battery: {
        name: 'Battery',
        type: Number,
        required: true,
        default: 0
    },
    assault: {
        name: 'Assault',
        type: Number,
        required: true,
        default: 0
    },
    resistingArrest: {
        name: 'ResistingArest',
        type: Number,
        required: true,
        default: 0
    },
        // Pitching
    praying: {
        name: 'Praying',
        type: Number,
        required: true,
        default: 0
    },
    publicity: {
        name: 'Publicity',
        type: Number,
        required: true,
        default: 0
    },
    pope: {
        name: 'Pope',
        type: Number,
        required: true,
        default: 0
    },
        // Running
    hammer: {
        name: 'Hammer',
        type: Number,
        required: true,
        default: 0
    },
    stalin: {
        name: 'Stalin',
        type: Number,
        required: true,
        default: 0
    },
    sickle: {
        name: 'Sickle',
        type: Number,
        required: true,
        default: 0
    },
        // Fielding
    clooning: {
        name: 'Clooning',
        type: Number,
        required: true,
        default: 0
    },
    throwing: {
        name: 'Return Of The Killer Tomatoes 2',
        type: Number,
        required: true,
        default: 0
    },
    batman: {
        name: 'Batman',
        type: Number,
        required: true,
        default: 0
    },
    fans: {
        name: 'Fans',
        type: Array,
        required: true,
        default: []
    },
    sitefans: {
        name: 'Site Fans',
        type: Array,
        required: true,
        default: []
    },
    birthday: {
        name: 'Birthday',
        type: Number,
        required: true,
        default: 0
    },
    favNum: {
        name: 'Favorite Number',
        type: Number,
        required: true,
        default: 0
    },
    favSes: {
        name: 'Favorite Season',
        type: Number,
        required: true,
        default: 0
    },
    favPos: {
        name: 'Favorite Lineup Position',
        type: Number,
        required: true,
        default: 0
    },
    starAlignment: {
        name: 'Star Color',
        type: Number,
        required: true,
        default: 0
    },
    favHol: {
        name: 'Favorite Holiday',
        type: String,
        required: true,
        default: "None"
    },
    favSoup: {
        name: 'Favorite Soup',
        type: String,
        required: true,
        default: "None"
    },
    eyeCount: {
        name: 'Eye Count',
        type: Number,
        required: true,
        default: 2
    }
});

module.exports = model('PlayerData', playerDataSchema, "players");