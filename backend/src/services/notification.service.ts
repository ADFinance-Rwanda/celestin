import { Prisma } from '../generated/prisma/browser';
import { NotificationType } from '../generated/prisma/enums';
import { prisma } from '../lib/prisma';
import { getIO } from '../lib/socket';

interface CreateNotificationDTO {
  userId: string;
  taskId?: string;
  type: NotificationType;
  message: string;
}

export class NotificationService {
  async createNotification(data: CreateNotificationDTO) {
    const notification = await prisma.notification.create({
      data,
      include: {
        task: {
          select: { id: true, title: true },
        },
      },
    });

    try {
      const io = getIO();
      io.to(`user:${data.userId}`).emit('notification', notification);
    } catch (error) {
      console.error('Socket.IO error:', error);
    }

    return notification;
  }

  async getNotifications(
    userId: string,
    unreadOnly: boolean = false,
  ) {
    const where: Prisma.NotificationWhereInput = { userId };

    if (unreadOnly) {
      where.read = false;
    }

    return prisma.notification.findMany({
      where,
      include: {
        task: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
