require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB, getDbMode } = require('./config/db');
const { locationHandler } = require('./sockets/locationHandler');

const telemetryRoutes = require('./routes/telemetryRoutes');
const alertRoutes = require('./routes/alertRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const citizenRoutes = require('./routes/citizenRoutes');
const auditRoutes = require('./routes/auditRoutes');
const floodRoutes = require('./routes/floodRoutes');
const mlRoutes = require('./routes/mlRoutes');
const fieldReportRoutes = require('./routes/fieldReportRoutes');
const geographyRoutes = require('./routes/geographyRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const PORT = Number(process.env.PORT) || 5002;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.set('io', io);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DisasterShield backend is running' });
});

app.get('/api/status', async (req, res) => {
  try {
    const TelemetryNode = require('./models/TelemetryNode');
    const Alert = require('./models/Alert');
    const [nodeCount, alertCount] = await Promise.all([
      TelemetryNode.countDocuments(),
      Alert.countDocuments(),
    ]);
    res.json({
      status: 'ok',
      dbMode: getDbMode(),
      nodeCount,
      alertCount,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
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
app.use('/api/audit', auditRoutes);
app.use('/api/flood', floodRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/field-reports', fieldReportRoutes);
app.use('/api/geography', geographyRoutes);

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
