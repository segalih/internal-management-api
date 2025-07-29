/* eslint-disable @typescript-eslint/no-unused-vars */
// // CronJob.ts

import { DateTime } from 'luxon';
import cron from 'node-cron';
import { Op } from 'sequelize';

export class CronJob {
  // private orderStockService: OrderStockService;

  constructor() {
    // this.orderStockService = new OrderStockService();
    console.log('Cron job started');

    cron.schedule('0 * * * *', () => this.exampleCronJob());
  }

  private exampleCronJob() {
    console.log('Example cron job executed');
    // Add your custom cron job logic here
  }

}
