const express = require('express')
const router = express.Router()
const favoriteController = require('../controllers/favoriteController')

router.route('/player')
    .post(favoriteController.change)
    
router.route('/team')
.post(favoriteController.teamup)

module.exports = router