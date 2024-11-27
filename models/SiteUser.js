const { Schema, model } = require('mongoose');
jwt = require("jsonwebtoken")

const siteUserDataSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Please enter username.'],
        maxLength: 32,
    },
    password: {
        type: String,
        required: true,
        required: [true, 'Please enter password.'],
        minLength: [6, 'Password must be at least 6 characters long.'],
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
        default: 10,
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

// Get the token
siteUserDataSchema.methods.jwtGenerateToken = function() {
    return jwt.sign({
        id: this.id
    }, process.env.JWT, {expiresIn: 3600})
}

module.exports = model('SiteUserData', siteUserDataSchema, "siteusers");