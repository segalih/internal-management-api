import configConstants from '@config/constants';
import License from '@database/models/license.model';
import logger from '@helper/logger';
import axios from 'axios';
import { DateTime } from 'luxon';
import { Op } from 'sequelize';

interface FactSet {
  title: string;
  value: string;
}

export class LicenseCheckerJob {
  public async check() {
    logger.info('Running license checker...');
    const to90Days = DateTime.now().plus({ days: 90 });

    const licensesUnder90Days = await License.findAll({
      where: {
        dueDateLicense: {
          [Op.lte]: to90Days.toISODate(),
        },
        isNotified: true,
      },
    });

    const factSets: FactSet[] = licensesUnder90Days.map((license) => {
      const _license = license;
      const dueDate = _license.dueDateLicense;
      const dayRemaining = Math.ceil(DateTime.fromISO(dueDate.toString(), { zone: 'UTC' }).diffNow('days').days);
      const wordingRemaining = dayRemaining >= 0 ? `${dayRemaining} hari lagi` : `${-dayRemaining} hari yang lalu`;
      const alertWording = `due date: ${DateTime.fromISO(dueDate.toString(), { zone: 'UTC' })
        .setLocale('id')
        .toFormat('DDDD')}, ${wordingRemaining}`;
      return {
        title: _license.application,
        value: alertWording,
      };
    });

    const payload = {
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          contentUrl: null,
          content: {
            type: 'AdaptiveCard',
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.5',
            body: [
              {
                type: 'TextBlock',
                size: 'Large',
                weight: 'Bolder',
                text: '⚠️ License Akan Habis',
                color: 'Attention',
              },
              {
                type: 'TextBlock',
                text: 'Berikut adalah daftar license yang akan habis dalam beberapa hari ke depan:',
                wrap: true,
                spacing: 'Small',
              },
              {
                type: 'FactSet',
                facts: factSets,
              },
              {
                type: 'TextBlock',
                text: 'Segera lakukan perpanjangan untuk menghindari gangguan layanan.',
                wrap: true,
                size: 'Medium',
                color: 'Default',
              },
            ],
            actions: [
              {
                type: 'Action.OpenUrl',
                title: 'Lihat Detail',
                url: 'https://example.com',
              },
            ],
          },
        },
      ],
    };
    if (configConstants.IS_BSI_NETWORK) {
      console.log('Sending message...');
      try {
        console.log('Sending message...');
        const result = await axios.post(
          'https://prod-63.southeastasia.logic.azure.com:443/workflows/319ad59082014d80b8adf621b19f5615/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GZufoLjUoXpLYbBukaokr8hrJQA0hY8ral5xUI5CWno',
          payload
        );
        logger.info('Message sent successfully.');
        console.log('Message sent successfully.');
        console.log(result.data);
      } catch (error) {
        logger.error('Error sending message:', error);
      }
    }
  }
}
