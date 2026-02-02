import { Server as HttpServer } from 'http';

import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';

import config from '../config/config';

let io: SocketServer;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      type DecodedToken = {
        id: string;
        iat: number;
        exp: number;
      };
      const decoded = jwt.verify(
        token,
        config.JWT_SECRET,
      ) as DecodedToken;
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      console.error('JWT verification error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', socket => {
    console.log('User connected:', socket.data.userId);

    socket.join(`user:${socket.data.userId}`);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId);
    });
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
