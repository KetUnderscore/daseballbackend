const { Schema, model } = require('mongoose');

const siteUserDataSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    favTeam: {
        type: String,
        default: 'None',
    },
    favplayer: {
        type: String,
        default: 'None',
    },
    coins: {
        type: Number,
        default: 100,
    },
    bets: {
        type: Number,
        default: 0,
    },
    peanuts: {
        type: Number,
        default: 0,
    },
    crackerJacks: {
        type: Number,
        default: 0,
    },
    item: {
        type: Object,
        default: {name:"None",
            description:"None",
            cost:0,
            stats:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            property:"None",
            modifiers:[]
        },
    },
    betMatrix: {
        type: Array,
        default: [],
    },
}, {timestamps: true});

module.exports = model('SiteUserData', siteUserDataSchema, "siteusers");