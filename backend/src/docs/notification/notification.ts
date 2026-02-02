export const notification = {
  '/notifications': {
    get: {
      tags: ['Notifications'],
      security: [{ JWT: [] }],
      summary: 'Get notifications',
      description:
        'Retrieve a list of notifications for the authenticated user',
      responses: {
        '200': {
          description: 'A list of notifications',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  },
  '/notifications/{id}/read': {
    put: {
      tags: ['Notifications'],
      security: [{ JWT: [] }],
      summary: 'Mark notification as read',
      description: 'Mark a specific notification as read',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID of the notification to mark as read',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        '200': {
          description: 'Notification marked as read',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  },
  '/notifications/read-all': {
    put: {
      tags: ['Notifications'],
      security: [{ JWT: [] }],
      summary: 'Mark all notifications as read',
      description:
        'Mark all notifications for the authenticated user as read',
      responses: {
        '200': {
          description: 'All notifications marked as read',
        },
        '500': {
          description: 'Internal server error',
        },
      },
    },
  },
};
