/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import expressListEndpoints from 'express-list-endpoints';
import helmet from 'helmet';
import path from 'path';
import 'reflect-metadata'; // <= PENTING!
import { Routes } from './routeSetup';
import { CronJob } from './cronjob/cronjob';

const Reset = '\x1b[0m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';

export default class Server {
  public expressInstance: express.Express;
  private routes: Routes;

  constructor() {
    this.expressInstance = express();
    this.middlewareSetup();
    this.routes = new Routes(this.expressInstance);
    this.printRegisteredRoutes();
    this.initializeClient();

    // new CronJob();
  }

  private initializeClient() {
    const clientPath = '../../client/build';
    this.expressInstance.use(express.static(path.join(__dirname, clientPath)));
  }

  private middlewareSetup() {
    // Setup common security protection (Helmet should come first)
    this.expressInstance.use(helmet());
    // Setup Cross-Origin Resource Sharing (CORS) - can be configured as needed
    this.expressInstance.use(cors());
    // Setup request body parsing (BodyParser should come before routes)
    this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
    this.expressInstance.use(bodyParser.json());
    // Setup request compression (Should be the last middleware)
    this.expressInstance.use(compression());
  }

  private printRegisteredRoutes() {
    console.info(`\n`);

    function printLog(method: string, path: string) {
      console.info(`${FgYellow}Registered route: ${FgGreen}${method} ${path}` + Reset);
    }

    const routes = expressListEndpoints(this.expressInstance);
    routes.forEach((route: any) => {
      if (route.methods.length > 1) {
        route.methods.forEach((method: string) => {
          printLog(method, route.path);
        });
      } else {
        printLog(route.methods[0], route.path);
      }
    });
  }
}
