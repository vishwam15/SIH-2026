const activePositions = new Map();
const activeSos = new Map();

const sanitize = (payload) => ({
  userId: payload.userId,
  role: payload.role,
  lat: Number(payload.lat),
  lng: Number(payload.lng),
  heading: Number(payload.heading ?? 0),
  speed: Number(payload.speed ?? 0),
  timestamp: payload.timestamp || new Date().toISOString(),
});

const locationHandler = (io) => {
  io.on('connection', (socket) => {
    socket.on('user:location_update', (payload) => {
      if (!payload || !payload.userId || !payload.lat || !payload.lng) return;

      const position = sanitize(payload);
      activePositions.set(payload.userId, position);

      const room = 'dashboard-room';
      io.to(room).emit('location:update', {
        ...position,
        socketId: socket.id,
      });

      if (payload.role === 'citizen') {
        io.to(room).emit('citizen:position', position);
      }
    });

    socket.on('sos:triggered', (payload) => {
      if (!payload || !payload.userId || !payload.lat || !payload.lng) return;

      const sosPayload = {
        userId: payload.userId,
        role: payload.role || 'citizen',
        lat: Number(payload.lat),
        lng: Number(payload.lng),
        timestamp: payload.timestamp || new Date().toISOString(),
        severity: payload.severity || 'CRITICAL',
      };

      activeSos.set(payload.userId, sosPayload);
      io.to('dashboard-room').emit('sos:active', sosPayload);
    });

    socket.on('join-dashboard', () => {
      socket.join('dashboard-room');
    });
  });
};

module.exports = {
  locationHandler,
  activePositions,
  activeSos,
};
