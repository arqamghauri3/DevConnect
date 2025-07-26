const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('🔗 User connected:', socket.id);

    // Handle user joining a conversation room
    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`👥 User ${socket.id} joined conversation: ${conversationId}`);
    });

    // Handle sending messages
    socket.on('send-message', (messageData) => {
      console.log('📨 Message received:', messageData);
      // Broadcast to all users in the conversation room
      io.to(messageData.conversationId).emit('receive-message', messageData);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('user-typing', {
        userId: data.userId,
        username: data.username
      });
    });

    socket.on('stop-typing', (data) => {
      socket.to(data.conversationId).emit('user-stopped-typing', {
        userId: data.userId
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`🚀 Server ready on http://localhost:${PORT}`);
  });
});