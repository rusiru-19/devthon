require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});


app.get('/', (req, res) => {
  res.json({ message: 'Express server running' });
});

// Login route
app.post('/login', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.status(200).json({
      message: 'Login verified',
      uid: decoded.uid,
      email: decoded.email
    });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// ================== SOCKET.IO ==================

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// ================== START SERVER ==================

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
