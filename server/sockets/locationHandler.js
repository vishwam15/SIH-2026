const activePositions = new Map();
const activeSos = new Map();

const sanitize = (payload) => ({
  userId: payload.userId,
  socketId: payload.socketId,
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
      if (
        !payload ||
        !payload.userId ||
        !Number.isFinite(Number(payload.lat)) ||
        !Number.isFinite(Number(payload.lng))
      ) return;

      const position = sanitize({ ...payload, socketId: socket.id });
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
      if (
        !payload ||
        !payload.userId ||
        !Number.isFinite(Number(payload.lat)) ||
        !Number.isFinite(Number(payload.lng))
      ) return;

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
      socket.emit('dashboard:snapshot', {
        locations: Array.from(activePositions.values()),
        sos: Array.from(activeSos.values()),
      });
    });

    socket.on('disconnect', () => {
      for (const [userId, position] of activePositions.entries()) {
        if (position.socketId === socket.id) activePositions.delete(userId);
      }
    });

    socket.on('rescue:dispatch', (payload) => {
      if (!payload?.sosUserId || !payload?.responderId) return;
      io.to('dashboard-room').emit('rescue:dispatch', {
        ...payload,
        dispatchedAt: new Date().toISOString(),
      });
    });
  });
};

module.exports = {
  locationHandler,
  activePositions,
  activeSos,
};
