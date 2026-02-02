export const dashboard = {
  '/dashboard/stats': {
    get: {
      tags: ['Dashboard'],
      security: [{ JWT: [] }],
      summary: 'Get dashboard statistics',
      description:
        'Retrieve various statistics for the user dashboard.',
      parameters: [
        {
          name: 'userId',
          in: 'query',
          description: 'Filter stats by user ID',
          required: false,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Dashboard statistics retrieved successfully',
        },
        401: {
          description: 'Unauthorized',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
};
