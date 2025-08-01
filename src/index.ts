import http from 'http';
import expressServer from './server';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
import { Request, Response } from 'express';
import logger from './logger';

dotenv.config();

// Normalize port number which will expose server
const port = normalizePort(process.env.PORT ?? 3000);

// Instantiate the expressServer class
const expressInstance = new expressServer().expressInstance;

// Make port available within server
expressInstance.set('port', port);

// Create the HTTP Express Server
const server = http.createServer(expressInstance);

// Start listening on the specified Port (Default: 3000)
server.listen(port);
server.on('error', (error: NodeJS.ErrnoException, res: Response) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  onError(error);
  logger.error(`Server error: ${error.message} - ${JSON.stringify(error)}`);
  res.status(500).send('Internal Server Error');
});
server.on('listening', onListening);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
server.on('request', (req: Request, res) => {
  const info = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  };
  console.info(JSON.stringify(info));
  logger.info(
    `Request: ${req.method} ${req.url} - Headers: ${JSON.stringify(req.headers)} - Body: ${JSON.stringify(req.body)}`
  );
});

// Port Normalization
function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    case 'ENOENT':
      console.error(`${bind} does not exist`);
      logger.error(`${bind} does not exist`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = <AddressInfo>server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `Listetning on port ${addr.port}`;
  console.info(bind);
  logger.info(`Listening on ${bind}`);
}
