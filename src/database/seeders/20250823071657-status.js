'use strict';

const mergeSeed = require('./utils/mergeSeed');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const statuses = [
      { id: 1, status_name: 'Open', flag: 1 },
      { id: 2, status_name: 'Temporary Action', flag: 1 },
      { id: 3, status_name: 'Full Action2', flag: 1 },
    ];

    await mergeSeed(queryInterface, 'master_statuses', statuses, 'id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_statuses', {
      id: { [Sequelize.Op.in]: [1, 2, 3] },
    });
  },
};
