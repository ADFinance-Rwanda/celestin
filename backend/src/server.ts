import { createServer } from 'http';

import app from './app';
import config from './config/config';
import { initializeSocket } from './lib/socket';

const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
