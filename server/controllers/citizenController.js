const User = require('../models/User');
const { logAction } = require('./auditController');

const sendSOS = async (req, res) => {
  try {
    const { latitude, longitude, message } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }

    const sosRecord = {
      userId: req.user._id,
      fullName: req.user.fullName,
      role: req.user.role,
      department: req.user.department,
      coordinates: {
        lat: Number(latitude),
        lng: Number(longitude),
      },
      message: message || 'Emergency SOS triggered by citizen.',
      createdAt: new Date(),
    };

    const user = await User.findById(req.user._id);
    if (user) {
      user.sosHistory = user.sosHistory || [];
      user.sosHistory.push(sosRecord);
      await user.save();
    }

    await logAction({
      actorId: req.user._id,
      actorName: req.user.fullName,
      actorRole: req.user.role,
      action: 'SOS_TRIGGERED',
      targetType: 'sos',
      details: sosRecord.coordinates,
    });

    res.status(201).json({
      success: true,
      message: 'SOS alert dispatched to nearby response teams.',
      sos: sosRecord,
    });
  } catch (error) {
    res.status(500).json({ message: 'SOS dispatch failed', error: error.message });
  }
};

module.exports = {
  sendSOS,
};
