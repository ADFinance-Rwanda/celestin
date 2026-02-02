import os from 'os';

import config from '../config/config';

import swaggerDoc from './swagger.json';
import { auth } from './users/auth';
import { dashboard } from './dashboard/dashboard';
import { task } from './task/task';
import { notification } from './notification/notification';
const defaults = swaggerDoc.paths;

const paths = {
  ...defaults,
  ...auth,
  ...dashboard,
  ...task,
  ...notification,
};

const swaggerOptions = {
  swagger: '2.0',
  info: {
    version: '1.0.0.',
    title: 'ADFinance Task Management API Documentation',
    description: '',
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      name: `${os.hostname()}`,
    },
    {
      url: `https://${config.host}`,
      name: `${os.hostname()}`,
    },
  ],
  basePath: `/api/${config.apiVersion || 'v1'}`,
  schemes: ['http', 'https'],
  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  tags: [
    {
      name: 'ADFinance Task Management API Documentation',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths,
};
export default swaggerOptions;
