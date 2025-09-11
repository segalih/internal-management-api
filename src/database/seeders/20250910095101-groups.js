'use strict';

const mergeSeed = require('./utils/mergeSeed');

module.exports = {
  async up(queryInterface, Sequelize) {
    const groups = [
      { id: 1, name: 'ASP' },
      { id: 2, name: 'IDG' },
      { id: 3, name: 'IOG22' },
    ];

    await mergeSeed(queryInterface, 'master_groups', groups, 'id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MASTER_GROUPS', {
      ID: { [Sequelize.Op.in]: [1, 2, 3] },
    });
  },
};
