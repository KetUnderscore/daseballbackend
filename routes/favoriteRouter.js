const express = require('express')
const router = express.Router()
const favoriteController = require('../controllers/favoriteController')

router.route('/player')
    .post(favoriteController.change)
    
router.route('/team')
.post(favoriteController.teamup)
    
router.route('/bet')
.post(favoriteController.bet)

module.exports = router