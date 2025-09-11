'use strict';

const mergeSeed = require('./utils/mergeSeed');

module.exports = {
  async up(queryInterface, Sequelize) {
    const departments = [
      { id: 1, group_id: 1, name: 'Financing & Collection Services' },
      { id: 2, group_id: 1, name: 'Release' },
      { id: 3, group_id: 1, name: 'Core22' },
    ];

    await mergeSeed(queryInterface, 'master_departments', departments, 'id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_departments', {
      id: { [Sequelize.Op.in]: [1, 2, 3] },
    });
  },
};
