const { Schema, model } = require('mongoose');

const userDataSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
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
    lastDaily: {
        type: Date,
        default: "1970-01-01T00:00:00.000+00:00",
    },
    lastDailyPlayer: {
        type: Date,
        default: "1970-01-01T00:00:00.000+00:00",
    },
});

module.exports = model('UserData', userDataSchema, "users");