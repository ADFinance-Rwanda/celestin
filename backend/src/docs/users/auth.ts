export const auth = {
  '/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description: 'Endpoint to register a new user',
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'User registration details',
          required: true,
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['name', 'email', 'password'],
          },
        },
      ],
      responses: {
        201: {
          description: 'User registered successfully',
        },
        400: {
          description: 'Bad request',
        },
        409: {
          description: 'User already exists',
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
  '/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'User login',
      description: 'Endpoint for user login',
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'User login details',
          required: true,
          schema: {
            type: 'object',
            properties: {
              email: { type: 'string' },
              password: { type: 'string' },
            },
            required: ['email', 'password'],
          },
        },
      ],
      responses: {
        200: {
          description: 'User logged in successfully',
        },
        400: {
          description: 'Bad request',
        },
        401: {
          description: 'Invalid credentials',
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
  '/auth/profile': {
    get: {
      tags: ['Authentication'],
      security: [{ JWT: [] }],
      summary: 'Get user profile',
      description:
        'Endpoint to get the profile of the authenticated user',
      responses: {
        200: {
          description: 'User profile retrieved successfully',
        },
        401: {
          description: 'Unauthorized',
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
  '/auth/users': {
    get: {
      tags: ['Authentication'],
      security: [{ JWT: [] }],
      summary: 'Get all users',
      description: 'Endpoint to get a list of all users',
      responses: {
        200: {
          description: 'Users retrieved successfully',
        },
        401: {
          description: 'Unauthorized',
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
};
