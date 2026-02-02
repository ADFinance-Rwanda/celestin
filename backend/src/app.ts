import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import config from './config/config';
import swaggerOptions from './docs';

const app = express();

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  `/api-docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerOptions),
);
app.use(`/api/${config.apiVersion}`, routes);
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
