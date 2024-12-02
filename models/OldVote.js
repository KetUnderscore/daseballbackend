const { Schema, model } = require('mongoose');

const oldVoteDataSchema = new Schema({
    voteType: { // Announcement, Acknowledgement or Allowance
        type: String,
        required: true,
    },
    voteName: {
        type: String,
        required: true,
    },
    voteEffect: {
        type: String,
        required: true,
    },
    voteEmoji: { // Emoji
        type: String,
        required: true,
    },
    voteCount: { // Total count of votes
        type: Number,
        required: true,
        default: 0,
    },
    teamVotes: { // Total count of votes for each team
        type: Array,
        required: true,
        default: [],
    },
    season: { // Season this vote was in
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = model('OldVoteData', oldVoteDataSchema, "oldvotes");