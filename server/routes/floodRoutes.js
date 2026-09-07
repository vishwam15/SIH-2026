const express = require('express');
const { getNowcast, ingestRadar, getDrainageNetwork, getRouteSafety } = require('../controllers/floodController');

const router = express.Router();

router.get('/nowcast', getNowcast);
router.post('/radar/nowcast', ingestRadar);
router.get('/drainage-network', getDrainageNetwork);
router.post('/route-safety', getRouteSafety);

module.exports = router;
