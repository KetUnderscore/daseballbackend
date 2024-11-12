const { Schema, model } = require('mongoose');

const seasonDataSchema = new Schema({
    seasonNumber: {
        type: Number,
        default: 0,
    },
    seasonDay: {
        type: Number,
        default: 1,
    },
    teamLayout: { // How the teams are layed out in each league and conference
        type: Array,
        default: ["Baltimore Mob", "Portland Sunsets", "New York Rats",
        "Fresno Femboys", "Seattle Scabs", "Kansas City Mints",
        "Pacific Ocean Prawns", "Transports", "Dublin Seasons",
        "Boston Bee Boys", "Denver Killers", "Sox Puppets"],
    },
    postseasonTeamLayout: { // How the teams are layed out for the postseason
        type: Array,
        default: [],
    },
    seasonChampion: {
        type: Array,
        default: [],
    },
    playoffTeams: {
        type: Array,
        default: [],
    },
    inTheRunning: {
        type: Array,
        default: ["Baltimore Mob", "Portland Sunsets", "New York Rats",
        "Fresno Femboys", "Seattle Scabs", "Kansas City Mints",
        "Pacific Ocean Prawns", "Transports", "Dublin Seasons",
        "Boston Bee Boys", "Denver Killers", "Sox Puppets"]
    },
    partyingTeams: {
        type: Array,
        default: [],
    },
    schedule: { // Seasons schedule
        type: Array,
        default: [],
    },
    postSeasonSchedule: { // Seasons schedule
        type: Array,
        default: [],
    },
    weather: { // Seasons weather schedule
        type: Array,
        default: [],
    },
    postSeasonWeather: { // Seasons weather schedule
        type: Array,
        default: [],
    },
    seasonEvents: { // Seasons events
        type: Array,
        default: [],
    },
    scheduleTeamInfo: { // Seasons events
        type: Array,
        default: [],
    },
});

module.exports = model('SeasonData', seasonDataSchema, "season");