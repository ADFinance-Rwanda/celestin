export const task = {
  '/tasks': {
    post: {
      tags: ['Tasks'],
      security: [{ JWT: [] }],
      summary: 'Create a new task',
      description: 'Endpoint to create a new task',
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'Task details',
          required: true,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              dueDate: { type: 'string', format: 'date-time' },
              assignedToId: { type: 'string' },
            },
            required: ['title', 'dueDate'],
          },
        },
      ],
      responses: {
        201: {
          description: 'Task created successfully',
        },
        400: {
          description: 'Bad request',
        },
        500: {
          description: 'Server error',
        },
      },
    },
    get: {
      tags: ['Tasks'],
      security: [{ JWT: [] }],
      summary: 'Get tasks',
      description: 'Retrieve a list of tasks with optional filters',
      parameters: [
        {
          name: 'userId',
          in: 'query',
          description: 'Filter tasks by assigned user ID',
          required: false,
          schema: {
            type: 'string',
          },
        },
        {
          name: 'status',
          in: 'query',
          description: 'Filter tasks by status',
          required: false,
          schema: {
            type: 'string',
            enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
          },
        },
      ],
      responses: {
        200: {
          description: 'Tasks retrieved successfully',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/tasks/{id}': {
    put: {
      tags: ['Tasks'],
      security: [{ JWT: [] }],
      summary: 'Update a task',
      description: 'Endpoint to update an existing task',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID of the task to update',
          required: true,
          schema: {
            type: 'string',
          },
        },
        {
          in: 'body',
          name: 'body',
          description: 'Updated task details',
          required: true,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              dueDate: { type: 'string', format: 'date-time' },
              assignedToId: { type: 'string' },
              status: {
                type: 'string',
                enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
              },
            },
          },
        },
      ],
      responses: {
        200: {
          description: 'Task updated successfully',
        },
        400: {
          description: 'Bad request',
        },
        404: {
          description: 'Task not found',
        },
        500: {
          description: 'Server error',
        },
      },
    },
    delete: {
      tags: ['Tasks'],
      security: [{ JWT: [] }],
      summary: 'Delete a task',
      description: 'Endpoint to delete a task by ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID of the task to delete',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Task deleted successfully',
        },
        404: {
          description: 'Task not found',
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
};
