const { buildNowcast, ingestRadarNowcast, scoreRoute, drainageGraph } = require('../services/urbanFloodModel');

const getNowcast = (req, res) => {
  try {
    res.json(buildNowcast({ rainfallMmHr: req.query.rainfallMmHr, leadMinutes: req.query.leadMinutes, cityId: req.query.cityId, stateId: req.query.stateId }));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const ingestRadar = (req, res) => {
  try {
    res.status(202).json(ingestRadarNowcast(req.body));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDrainageNetwork = (req, res) => res.json({ geography: { cityId: req.query.cityId || null, stateId: req.query.stateId || null }, coverageStatus: 'DEMO_ONLY_MUMBAI_FIXTURES', nodes: drainageGraph });

const getRouteSafety = (req, res) => {
  try {
    res.json(scoreRoute(req.body?.coordinates || []));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getNowcast, ingestRadar, getDrainageNetwork, getRouteSafety };
