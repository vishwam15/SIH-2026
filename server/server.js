require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const { locationHandler } = require('./sockets/locationHandler');

const telemetryRoutes = require('./routes/telemetryRoutes');
const alertRoutes = require('./routes/alertRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const citizenRoutes = require('./routes/citizenRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const PORT = Number(process.env.PORT) || 5002;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.set('io', io);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DisasterShield backend is running' });
});

locationHandler(io);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

app.use('/api/telemetry', telemetryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/citizen', citizenRoutes);

const broadcastUpdate = (event, payload) => {
  io.to('dashboard-room').emit(event, payload);
};

app.locals.broadcastUpdate = broadcastUpdate;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`DisasterShield backend listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { io, broadcastUpdate };
