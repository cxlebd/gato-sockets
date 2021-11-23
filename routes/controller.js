const express = require('express');
const router = express.Router();

const logic = require('../logic/main.js');

router.get('/', logic.start);
router.get('/start',logic.start);
router.get('/start/game',logic.game);

module.exports = router;