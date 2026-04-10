import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3333;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Attach io to app to use in controllers/services
app.set('io', io);

server.listen(port, () => {
  console.log(`[Fluxora Server] Running on http://localhost:${port}`);
});
