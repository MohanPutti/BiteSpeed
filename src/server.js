import https from 'https';
import path from 'path';
import fs from 'fs';
import express from 'express';
import config from '../config/index.js';

// mysql db models
import './models/index.js';

// routes
import allRoutes from './routes/routes.js';



const startServer = async () => {


  const app = express();

  // app.use(express.urlencoded({ extended: true  }));
  app.use(express.json());

  allRoutes(app);
  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 500;
    next(error);
  });


  const router = express.Router();

  const __dirname = path.resolve();

  let sslServer, server;
  if (config.app.https == 'true') {
    /* for https only */
    sslServer = https.createServer(
      {
        key: fs.readFileSync(path.join(path.resolve(), 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(path.resolve(), 'cert', 'cert.pem')),
      },
      app
    );
    sslServer.listen(config.app.port, () => {
      console.log(`https  server started on port ${config.app.port}`);
    });
  } else {
    /* for http only */
    server = app.listen(config.app.port, () => {
      console.log(`http only started server on port ${config.app.port}`);
    });
  }

  process.on('uncaughtException', (err) => {
    console.log(`There is uncaught exception in the application`);
  });

  process.on('unhandledRejection', (err) => {
    console.log(`There is unhandled rejection in the application`);
  });

  process.on('SIGTERM', () => {
    console.log('recieved SIGTERM signal');
    const serverRunning = server || sslServer;
    serverRunning.close(() => {
      console.log('closing server');
      dbConnectionClose();
      process.exit(0);
    });
  });
  // return;
};

startServer();
